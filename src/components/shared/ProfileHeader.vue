<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from './BaseCard.vue'
import LevelBadge from './LevelBadge.vue'
import TabNav from './TabNav.vue'
import type { ProfileTab, User } from '@/types'

const props = withDefaults(
  defineProps<{
    user: User
    tabs: ProfileTab[]
    levelName?: string
    size?: 'md' | 'lg'
    showStatus?: boolean
  }>(),
  { levelName: '', size: 'md', showStatus: false },
)

const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`)
const avatarClass = computed(() => (props.size === 'lg' ? 'size-16' : 'size-14'))
const nameClass = computed(() => (props.size === 'lg' ? 'text-xl' : 'text-lg'))
</script>
<template>
  <BaseCard flush>
    <div class="flex flex-wrap items-center gap-4 px-5 pt-5 pb-4">
      <img
        :src="user.avatar"
        :alt="fullName"
        class="ring-passport-400/40 bg-ink-700 rounded-2xl object-cover ring-2"
        :class="avatarClass"
      />
      <div class="min-w-0 flex-1">
        <h2 class="text-ink-50 truncate font-semibold" :class="nameClass">{{ fullName }}</h2>
        <p class="text-ink-500 truncate text-sm">@{{ user.username }} · {{ user.province }}</p>
      </div>
      <div class="flex items-center gap-2">
        <LevelBadge :level="user.level" :name="levelName" :size="size" />
        <span
          v-if="showStatus"
          class="rounded-full px-2.5 py-1 text-xs font-semibold"
          :class="user.active ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
        >
          {{ user.active ? 'Active' : 'Deactivated' }}
        </span>
      </div>
    </div>
    <div class="px-5">
      <TabNav :tabs="tabs" />
    </div>
  </BaseCard>
</template>
