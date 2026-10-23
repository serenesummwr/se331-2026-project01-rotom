import type { User, UserRegistration } from '@/types'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
  refreshToken: string
}

export interface RegisterRequest extends UserRegistration {
  password: string
}