import axios from 'axios'
import { tokenStorage } from '@/services/tokenStorage'
import type { LoginResponse } from '@/types/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not configured')
}

const refreshClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

let pendingRefresh: {
  refreshToken: string
  promise: Promise<LoginResponse>
} | null = null

export function refreshSession(): Promise<LoginResponse> {
  const stored = tokenStorage.read()

  if (!stored) {
    return Promise.reject(
      new Error('No session is available to refresh.'),
    )
  }

  if (pendingRefresh?.refreshToken === stored.refreshToken) {
    return pendingRefresh.promise
  }

  const refreshToken = stored.refreshToken

  const promise = requestRefresh(refreshToken).finally(() => {
    if (pendingRefresh?.promise === promise) {
      pendingRefresh = null
    }
  })

  pendingRefresh = {
    refreshToken,
    promise,
  }

  return promise
}

async function requestRefresh(
  refreshToken: string,
): Promise<LoginResponse> {
  const response = await refreshClient.post<LoginResponse>(
    '/auth/refresh-token',
    { refreshToken },
  )

  const current = tokenStorage.read()

  if (current?.refreshToken !== refreshToken) {
    throw new axios.CanceledError(
      'Session changed while refreshing tokens.',
    )
  }

  tokenStorage.write({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  })

  return response.data
}