import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/services/tokenStorage'
import { refreshSession } from '@/services/tokenRefresh'
import type { LoginResponse } from '@/types/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not configured')
}

interface AuthHandlers {
  getSessionVersion: () => number
  onRefreshed: (response: LoginResponse) => void
  onExpired: () => void
}

interface AuthRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean
  _authVersion?: number
}

let authHandlers: AuthHandlers | null = null

export function configureApiAuth(handlers: AuthHandlers): void {
  authHandlers = handlers
}

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

const publicAuthPaths = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
])

function isPublicAuthRequest(config: InternalAxiosRequestConfig) {
  const path = config.url?.split('?')[0] ?? ''
  return publicAuthPaths.has(path)
}

function assertSameSession(config: AuthRequestConfig): void {
  if (
    authHandlers &&
    config._authVersion !== authHandlers.getSessionVersion()
  ) {
    throw new axios.CanceledError(
      'Session changed while the request was running.',
    )
  }
}

function expireSession(config: AuthRequestConfig): void {
  assertSameSession(config)

  if (authHandlers) {
    authHandlers.onExpired()
  } else {
    tokenStorage.clear()
  }
}

api.interceptors.request.use((request) => {
  const config = request as AuthRequestConfig

  if (isPublicAuthRequest(config)) {
    config.headers.delete('Authorization')
    return config
  }

  config._authVersion = authHandlers?.getSessionVersion()

  const stored = tokenStorage.read()

  if (stored) {
    config.headers.set(
      'Authorization',
      `Bearer ${stored.accessToken}`,
    )
  } else {
    config.headers.delete('Authorization')
  }

  return config
})

api.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError<{ code?: string }>(error)) {
      throw error
    }

    const config = error.config as AuthRequestConfig | undefined

    if (!config || isPublicAuthRequest(config)) {
      throw error
    }

    const status = error.response?.status

    if (
      status === 403 &&
      error.response?.data?.code === 'ACCOUNT_DISABLED'
    ) {
      expireSession(config)
      throw error
    }

    if (status !== 401) {
      throw error
    }

    assertSameSession(config)

    const stored = tokenStorage.read()

    if (!stored) {
      expireSession(config)
      throw error
    }

    const sentAuthorization = config.headers.get('Authorization')

    if (config._authRetry) {
      if (
        sentAuthorization === `Bearer ${stored.accessToken}`
      ) {
        expireSession(config)
      }

      throw error
    }

    config._authRetry = true

    if (
      sentAuthorization !== `Bearer ${stored.accessToken}`
    ) {
      return api.request(config)
    }

    let refreshed: LoginResponse

    try {
      refreshed = await refreshSession()
    } catch (refreshError: unknown) {
      assertSameSession(config)

      if (
        axios.isAxiosError(refreshError) &&
        (refreshError.response?.status === 401 ||
          refreshError.response?.status === 403)
      ) {
        expireSession(config)
      }

      throw refreshError
    }

    assertSameSession(config)

    const current = tokenStorage.read()

    if (current?.accessToken !== refreshed.accessToken) {
      throw new axios.CanceledError(
        'Session changed after refreshing tokens.',
      )
    }

    authHandlers?.onRefreshed(refreshed)

    return api.request(config)
  },
)