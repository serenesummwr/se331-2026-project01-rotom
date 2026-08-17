<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import { ChevronRight, SearchX } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { LevelId, User } from '@/types'

defineProps<{
  users: User[]
  levelNames: Record<number, string>
}>()
function detailRoute(user: User) {
  return { name: 'admin-user-info', params: { id: String(user.id) } }
}
</script>
<template>
  <EmptyState
    v-if="users.length === 0"
    :icon="SearchX"
    title="No members match these filters"
    hint="Try clearing the name, or widening the level and province."
  />
  <template v-else>
    <table class="hidden w-full text-left md:table">
      <thead class="text-ink-400 border-ink-700/70 border-b text-xs tracking-wide uppercase">
        <tr>
          <th class="px-5 py-3 font-medium">Member</th>
          <th class="px-5 py-3 font-medium">Province</th>
          <th class="px-5 py-3 font-medium">Level</th>
          <th class="px-5 py-3 font-medium">Status</th>
          <th class="px-5 py-3"><span class="sr-only">Open</span></th>
        </tr>
      </thead>
      <tbody class="divide-ink-700 divide-y">
        <tr v-for="user in users" :key="user.id" class="hover:bg-ink-700/30 transition">
          <td class="px-5 py-3">
            <RouterLink :to="detailRoute(user)" class="flex items-center gap-3">
              <img
                :src="user.avatar"
                :alt="`${user.firstName} ${user.lastName}`"
                class="bg-ink-700 size-9 rounded-lg object-cover"
              />
              <span class="min-w-0">
                <span class="text-ink-100 block truncate text-sm font-medium">
                  {{ user.firstName }} {{ user.lastName }}
                </span>
                <span class="text-ink-500 block truncate text-xs">@{{ user.username }}</span>
              </span>
            </RouterLink>
          </td>
          <td class="text-ink-300 px-5 py-3 text-sm">{{ user.province }}</td>
          <td class="px-5 py-3">
            <LevelBadge :level="user.level as LevelId" :name="levelNames[user.level]" size="sm" />
          </td>
          <td class="px-5 py-3">
            <span class="text-xs font-medium" :class="user.active ? 'text-success' : 'text-danger'">
              {{ user.active ? 'Active' : 'Deactivated' }}
            </span>
          </td>
          <td class="px-5 py-3 text-right">
            <RouterLink
              :to="detailRoute(user)"
              class="text-passport-400 hover:text-passport-300 inline-flex items-center gap-1 text-xs font-semibold"
            >
              Open
              <ChevronRight class="size-3.5" :stroke-width="2.5" />
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
    <ul class="divide-ink-700 divide-y md:hidden">
      <li v-for="user in users" :key="user.id">
        <RouterLink :to="detailRoute(user)" class="hover:bg-ink-700/30 flex items-center gap-3 p-4">
          <img
            :src="user.avatar"
            :alt="`${user.firstName} ${user.lastName}`"
            class="bg-ink-700 size-11 shrink-0 rounded-xl object-cover"
          />
          <span class="min-w-0 flex-1">
            <span class="text-ink-100 block truncate text-sm font-medium">
              {{ user.firstName }} {{ user.lastName }}
            </span>
            <span class="text-ink-500 block truncate text-xs">{{ user.province }}</span>
          </span>
          <span class="flex shrink-0 flex-col items-end gap-1">
            <LevelBadge :level="user.level as LevelId" size="sm" />
            <span class="text-[11px]" :class="user.active ? 'text-success' : 'text-danger'">
              {{ user.active ? 'Active' : 'Deactivated' }}
            </span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </template>
</template>
