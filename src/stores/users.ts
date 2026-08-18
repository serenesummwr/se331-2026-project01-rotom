import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LevelId, User, UserEditable, UserFilterState, UserRegistration } from '@/types'
export const PAGE_SIZE = 8

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const filters = ref<UserFilterState>({ name: '', level: 'all', province: 'all' })
  const page = ref(1)
  const memberList = computed(() => users.value.filter((user) => user.role === 'user'))
  const byId = computed(() => (id: number) => users.value.find((user) => user.id === id))
  const byUsername = computed(
    () => (username: string) =>
      users.value.find((user) => user.username.toLowerCase() === username.toLowerCase()),
  )
  const isUsernameTaken = computed(
    () => (username: string) => byUsername.value(username.trim()) !== undefined,
  )

  const filteredUsers = computed(() => {
    const term = filters.value.name.trim().toLowerCase()
    return memberList.value.filter((user) => {
      const haystack = `${user.firstName} ${user.lastName}`.toLowerCase()
      const matchesName = !term || haystack.includes(term)
      const matchesLevel = filters.value.level === 'all' || user.level === filters.value.level
      const matchesProvince =
        filters.value.province === 'all' || user.province === filters.value.province
      return matchesName && matchesLevel && matchesProvince
    })
  })
  const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / PAGE_SIZE)))
  const pagedUsers = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filteredUsers.value.slice(start, start + PAGE_SIZE)
  })
  const provinceOptions = computed(() =>
    [...new Set(memberList.value.map((user) => user.province))].sort((a, b) => a.localeCompare(b)),
  )
  const levelCounts = computed(() => {
    const counts: Record<LevelId, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
    for (const user of memberList.value) counts[user.level] = (counts[user.level] ?? 0) + 1
    return counts
  })
  const activeCount = computed(() => memberList.value.filter((user) => user.active).length)

  function setFilters(patch: Partial<UserFilterState>) {
    filters.value = { ...filters.value, ...patch }
    page.value = 1
  }
  function resetFilters() {
    filters.value = { name: '', level: 'all', province: 'all' }
    page.value = 1
  }
  function setPage(value: number) {
    page.value = Math.min(Math.max(1, Math.trunc(value) || 1), totalPages.value)
  }

  function hydrate(nextUsers: User[]) {
    users.value = nextUsers.map((user) => ({ ...user }))
    resetFilters()
  }

  function register(draft: UserRegistration): User {
    const username = draft.username.trim()
    const user: User = {
      id: Math.max(0, ...users.value.map((existing) => existing.id)) + 1,
      username,
      role: 'user',
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      province: draft.province,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(username)}&backgroundColor=1f2540,2a3150,343b58`,
      level: 1,
      active: true,
      joinedAt: new Date().toISOString(),
      bio: draft.bio.trim(),
    }
    users.value = [...users.value, user]
    return user
  }
  function updateUser(id: number, patch: UserEditable) {
    const index = users.value.findIndex((user) => user.id === id)
    if (index === -1) return
    users.value[index] = { ...users.value[index]!, ...patch }
  }
  function setActive(id: number, active: boolean) {
    const user = byId.value(id)
    if (user) user.active = active
  }
  function toggleActive(id: number) {
    const user = byId.value(id)
    if (user) user.active = !user.active
  }
  function upgradeLevel(id: number): LevelId | null {
    const user = byId.value(id)
    if (!user || user.level >= 4) return null
    user.level = (user.level + 1) as LevelId
    return user.level
  }
  return {
    users,
    filters,
    page,
    memberList,
    byId,
    byUsername,
    isUsernameTaken,
    filteredUsers,
    pagedUsers,
    totalPages,
    provinceOptions,
    levelCounts,
    activeCount,
    hydrate,
    setFilters,
    resetFilters,
    setPage,
    register,
    updateUser,
    setActive,
    toggleActive,
    upgradeLevel,
  }
})
