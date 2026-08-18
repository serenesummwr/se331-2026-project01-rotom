import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './users'
import type { Role, User } from '@/types'
const STORAGE_KEY = 'catpassport.session'

export const useAuthStore = defineStore('auth', () => {
  const currentUserId = ref<number | null>(null)
  const userStore = useUserStore()
  const currentUser = computed<User | null>(() =>
    currentUserId.value === null ? null : (userStore.byId(currentUserId.value) ?? null),
  )
  const isAuthenticated = computed(() => currentUser.value !== null)
  const role = computed<Role | null>(() => currentUser.value?.role ?? null)
  const isAdmin = computed(() => role.value === 'admin')
  const homeRoute = computed(() => (isAdmin.value ? 'admin-dashboard' : 'user-dashboard'))

  function login(username: string, _password?: string): User | null {
    const user = userStore.byUsername(username.trim())
    if (!user) return null
    currentUserId.value = user.id
    persist()
    return user
  }
  function logout() {
    currentUserId.value = null
    persist()
  }
  function persist() {
    if (typeof sessionStorage === 'undefined') return
    if (currentUserId.value === null) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, String(currentUserId.value))
  }

  function restore() {
    if (typeof sessionStorage === 'undefined') return
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const id = Number(stored)
    if (userStore.byId(id)) currentUserId.value = id
    else sessionStorage.removeItem(STORAGE_KEY)
  }
  return {
    currentUserId,
    currentUser,
    isAuthenticated,
    role,
    isAdmin,
    homeRoute,
    login,
    logout,
    restore,
  }
})
