<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import ProfileMenu from './ProfileMenu.vue'
import type { ProfileLink, User } from '@/types'

defineProps<{
  title: string
  subtitle?: string
  user: User
  levelName: string
  profileLinks: ProfileLink[]
}>()
const emit = defineEmits<{ 'toggle-nav': []; logout: [] }>()
</script>
<template>
  <header
    class="border-border bg-surface/85 sticky top-0 z-20 flex h-19 items-center gap-3 border-b px-4 backdrop-blur sm:px-6"
  >
    <button
      type="button"
      class="text-muted-foreground hover:bg-border hover:text-foreground -ms-1 rounded-lg p-2 lg:hidden"
      aria-label="Open navigation"
      @click="emit('toggle-nav')"
    >
      <Menu class="size-5" :stroke-width="1.75" />
    </button>
    <div class="min-w-0 flex-1">
      <h1 class="text-foreground truncate text-base font-semibold sm:text-lg">{{ title }}</h1>
      <p v-if="subtitle" class="text-muted-foreground truncate text-xs">{{ subtitle }}</p>
    </div>

    <ProfileMenu
      :user="user"
      :level-name="levelName"
      :links="profileLinks"
      @logout="emit('logout')"
    />
  </header>
</template>
