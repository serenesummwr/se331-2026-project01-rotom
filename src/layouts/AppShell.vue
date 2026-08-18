<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AppSidebar from '@/components/shared/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'
import type { NavItem, ProfileLink } from '@/types'

defineProps<{
  nav: NavItem[]
  profileLinks: ProfileLink[]
}>()
const auth = useAuthStore()
const levelStore = useLevelStore()
const route = useRoute()
const router = useRouter()
const navOpen = ref(false)
const navCollapsed = ref(false)

function toggleCollapsed() {
  navCollapsed.value = !navCollapsed.value
}

const title = computed(() => (route.meta.title as string | undefined) ?? 'CAT Passport')
const subtitle = computed(() => route.meta.subtitle as string | undefined)
const levelName = computed(() =>
  auth.currentUser ? levelStore.levelName(auth.currentUser.level) : '',
)
watch(
  () => route.fullPath,
  () => (navOpen.value = false),
)
function logout() {
  auth.logout()
  router.push({ name: 'landing' })
}
</script>
<template>
  <div v-if="auth.currentUser" class="bg-background min-h-dvh">
    <AppSidebar
      :items="nav"
      :open="navOpen"
      :collapsed="navCollapsed"
      @close="navOpen = false"
      @toggle-collapse="toggleCollapsed"
    />
    <div class="transition-[padding] duration-200" :class="navCollapsed ? 'lg:ps-16' : 'lg:ps-64'">
      <AppHeader
        :title="title"
        :subtitle="subtitle"
        :user="auth.currentUser"
        :level-name="levelName"
        :profile-links="profileLinks"
        @toggle-nav="navOpen = !navOpen"
        @logout="logout"
      />
      <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
