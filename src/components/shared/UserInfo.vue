<script setup lang="ts">
import { computed } from 'vue'
import LevelBadge from './LevelBadge.vue'
import type { User } from '@/types'

const props = defineProps<{
  user: User
  levelName?: string
  showStatus?: boolean
}>()
defineEmits<{ edit: [] }>()
const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`)
const joined = computed(() =>
  new Date(props.user.joinedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)
const rows = computed(() => [
  { label: 'Username', value: props.user.username },
  { label: 'Email', value: props.user.email },
  { label: 'Phone', value: props.user.phone },
  { label: 'Province', value: props.user.province },
  { label: 'Member since', value: joined.value },
])
</script>
<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-4">
      <img
        :src="user.avatar"
        :alt="fullName"
        class="ring-passport-400/40 bg-ink-700 size-16 rounded-2xl object-cover ring-2"
      />
      <div class="min-w-0">
        <h3 class="text-ink-50 truncate text-lg font-semibold">{{ fullName }}</h3>
        <p class="text-ink-400 text-sm">@{{ user.username }}</p>
      </div>
      <LevelBadge :level="user.level" :name="levelName" size="lg" class="ms-auto" />
    </div>
    <dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <div v-for="row in rows" :key="row.label">
        <dt class="text-ink-400 text-xs tracking-wide uppercase">{{ row.label }}</dt>
        <dd class="text-ink-100 mt-1 text-sm break-words">{{ row.value }}</dd>
      </div>
      <div v-if="showStatus">
        <dt class="text-ink-400 text-xs tracking-wide uppercase">Account status</dt>
        <dd class="mt-1 text-sm font-semibold" :class="user.active ? 'text-success' : 'text-danger'">
          {{ user.active ? 'Active' : 'Deactivated' }}
        </dd>
      </div>
    </dl>
    <div v-if="user.bio">
      <dt class="text-ink-400 text-xs tracking-wide uppercase">About</dt>
      <p class="text-ink-200 mt-1 text-sm leading-relaxed">{{ user.bio }}</p>
    </div>
    <div v-if="$slots.footer" class="border-ink-700/70 border-t pt-4">
      <slot name="footer" />
    </div>
  </div>
</template>