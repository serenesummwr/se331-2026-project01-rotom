<script setup lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue'
import type { LevelId, Level, UserFilterState } from '@/types'

defineProps<{
  filters: UserFilterState
  provinces: string[]
  levels: Level[]
  resultCount: number
}>()
const emit = defineEmits<{
  update: [patch: Partial<UserFilterState>]
  reset: []
}>()
const fieldClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-passport-400 focus:outline-none'
</script>
<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <label class="block lg:col-span-2">
      <span class="text-ink-400 mb-1.5 block text-xs tracking-wide uppercase">Name or surname</span>
      <input
        :value="filters.name"
        :class="fieldClass"
        placeholder="Search the directory…"
        @input="emit('update', { name: ($event.target as HTMLInputElement).value })"
      />
    </label>
    <label class="block">
      <span class="text-ink-400 mb-1.5 block text-xs tracking-wide uppercase">Level</span>
      <select
        :value="filters.level"
        :class="fieldClass"
        @change="
          emit('update', {
            level: (($event.target as HTMLSelectElement).value === 'all'
              ? 'all'
              : Number(($event.target as HTMLSelectElement).value)) as LevelId | 'all',
          })
        "
      >
        <option value="all">All levels</option>
        <option v-for="level in levels" :key="level.id" :value="level.id">
          {{ level.name }}
        </option>
      </select>
    </label>
    <label class="block">
      <span class="text-ink-400 mb-1.5 block text-xs tracking-wide uppercase">Province</span>
      <select
        :value="filters.province"
        :class="fieldClass"
        @change="emit('update', { province: ($event.target as HTMLSelectElement).value })"
      >
        <option value="all">All provinces</option>
        <option v-for="province in provinces" :key="province" :value="province">
          {{ province }}
        </option>
      </select>
    </label>
    <div class="text-ink-500 flex items-center gap-3 text-xs sm:col-span-2 lg:col-span-4">
      <span>{{ resultCount }} member{{ resultCount === 1 ? '' : 's' }} match</span>
      <BaseButton variant="ghost" size="sm" @click="emit('reset')">Clear filters</BaseButton>
    </div>
  </div>
</template>
