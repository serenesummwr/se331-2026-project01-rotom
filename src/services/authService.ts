import { api } from '@/services/api'
import type { User } from '@/types'
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth'

export const authService = {

  async register(request: RegisterRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/register',
    request,
  )

  return response.data
},

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/auth/login',
      request,
    )

    return response.data
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/auth/refresh-token',
      { refreshToken },
    )

    return response.data
  },

  async getMe(accessToken: string): Promise<User> {
    const response = await api.get<User>('/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.data
  },

  async logout(accessToken: string): Promise<void> {
    await api.post('/auth/logout', undefined, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}