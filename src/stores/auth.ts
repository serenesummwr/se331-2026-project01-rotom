import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService } from '@/services/authService'
import { tokenStorage } from '@/services/tokenStorage'
import type { Role, User } from '@/types'
import type { LoginResponse, RegisterRequest } from '@/types/auth'
import { profileService } from '@/services/profileService'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  const currentUserId = computed(
    () => currentUser.value?.id ?? null,
  )

  const isAuthenticated = computed(
    () => currentUser.value !== null,
  )

  const role = computed<Role | null>(
    () => currentUser.value?.role ?? null,
  )

  const isAdmin = computed(() => role.value === 'admin')

  const homeRoute = computed(() =>
    isAdmin.value ? 'admin-dashboard' : 'user-dashboard',
  )

  function applySession(response: LoginResponse): void {
    tokenStorage.write({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    })

    currentUser.value = response.user
  }

  function clearSession(): void {
    tokenStorage.clear()
    currentUser.value = null

    sessionStorage.removeItem('catpassport.session')
  }

  async function login(
    username: string,
    password: string,
  ): Promise<User> {
    const response = await authService.login({
      username: username.trim(),
      password,
    })

    applySession(response)

    return response.user
  }

  async function register(request: RegisterRequest): Promise<User> {
  const response = await authService.register(request)

  applySession(response)

  return response.user
  }

  async function uploadAvatar(file: File): Promise<User> {
  const stored = tokenStorage.read()
  const userId = currentUser.value?.id

  if (!stored || userId === undefined) {
    throw new Error('Please sign in before uploading an image.')
  }

  const updatedUser = await profileService.uploadAvatar(
    file,
    stored.accessToken,
  )

  if (currentUser.value?.id === userId) {
    currentUser.value = updatedUser
  }

  return updatedUser
}

  async function restore(): Promise<void> {
    const stored = tokenStorage.read()

    if (!stored) {
      currentUser.value = null
      return
    }

    try {
      currentUser.value = await authService.getMe(
        stored.accessToken,
      )
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) throw error

      const status = error.response?.status

      if (status === 403) {
        clearSession()
        return
      }

      if (status !== 401) {
        throw error
      }

      try {
        const response = await authService.refreshToken(
          stored.refreshToken,
        )

        applySession(response)
      } catch (refreshError: unknown) {
        if (
          axios.isAxiosError(refreshError) &&
          (refreshError.response?.status === 401 ||
            refreshError.response?.status === 403)
        ) {
          clearSession()
          return
        }

        throw refreshError
      }
    }
  }

  async function logout(): Promise<void> {
    const stored = tokenStorage.read()

    try {
      if (stored) {
        await authService.logout(stored.accessToken)
      }
    } finally {
      clearSession()
    }
  }

  return {
    currentUser,
    currentUserId,
    isAuthenticated,
    role,
    isAdmin,
    homeRoute,
    login,
    logout,
    register,
    restore,
    uploadAvatar,
  }
})