<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import BaseCard from '@/components/shared/BaseCard.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import { useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'
import { useExamStore } from '@/stores/exam'
import type { LevelId } from '@/types'

const barColour: Record<LevelId, string> = {
  1: 'bg-level-1',
  2: 'bg-level-2',
  3: 'bg-level-3',
  4: 'bg-level-4',
}

const router = useRouter()
const userStore = useUserStore()
const levelStore = useLevelStore()
const examStore = useExamStore()
const total = computed(() => userStore.memberList.length)
const stats = computed(() => [
  { label: 'Members', value: total.value, hint: 'in the directory' },
  { label: 'Active', value: userStore.activeCount, hint: 'able to use the service' },
  {
    label: 'Deactivated',
    value: total.value - userStore.activeCount,
    hint: 'suspended accounts',
  },
  { label: 'Exam attempts', value: examStore.attempts.length, hint: 'recorded so far' },
])
const distribution = computed(() =>
  levelStore.levels.map((level) => {
    const count = userStore.levelCounts[level.id] ?? 0
    return {
      level,
      count,
      share: total.value === 0 ? 0 : Math.round((count / total.value) * 100),
    }
  }),
)
const recentAttempts = computed(() =>
  [...examStore.attempts]
    .sort((a, b) => Date.parse(b.attemptedAt) - Date.parse(a.attemptedAt))
    .slice(0, 6)
    .map((attempt) => ({
      ...attempt,
      user: userStore.byId(attempt.userId),
      when: new Date(attempt.attemptedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    })),
)
</script>
<template>
  <div class="space-y-5">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="border-ink-700/70 bg-ink-800/60 rounded-2xl border p-5"
      >
        <p class="text-ink-400 text-xs tracking-wide uppercase">{{ stat.label }}</p>
        <p class="text-ink-50 mt-2 text-3xl font-semibold">{{ stat.value }}</p>
        <p class="text-ink-500 mt-1 text-xs">{{ stat.hint }}</p>
      </div>
    </div>
    <div class="grid gap-5 lg:grid-cols-2">
      <BaseCard title="Members by level" subtitle="Where the directory sits today">
        <ul class="space-y-4">
          <li v-for="row in distribution" :key="row.level.id">
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <LevelBadge :level="row.level.id as LevelId" :name="row.level.name" size="sm" />
              <span class="text-ink-400 text-xs">{{ row.count }} · {{ row.share }}%</span>
            </div>
            <div class="bg-ink-600 h-2 overflow-hidden rounded-full">
              <div
                class="h-full rounded-full"
                :class="barColour[row.level.id as LevelId]"
                :style="{ width: `${row.share}%` }"
              />
            </div>
          </li>
        </ul>
      </BaseCard>
      <BaseCard title="Recent exam attempts" subtitle="Across every member">
        <template #actions>
          <RouterLink
            :to="{ name: 'admin-users' }"
            class="text-passport-400 hover:text-passport-300 inline-flex items-center gap-1 text-xs font-semibold"
          >
            Open directory
            <ChevronRight class="size-3.5" :stroke-width="2.5" />
          </RouterLink>
        </template>
        <ul class="divide-ink-700 -my-2 divide-y">
          <li
            v-for="attempt in recentAttempts"
            :key="attempt.id"
            class="flex items-center gap-3 py-3"
          >
            <img
              v-if="attempt.user"
              :src="attempt.user.avatar"
              :alt="attempt.user.firstName"
              class="bg-ink-700 size-9 rounded-lg object-cover"
            />
            <span class="min-w-0 flex-1">
              <!--
                The level tab lives in Chapter 08. Until that route exists the name
                still has to render, so it falls back to plain text rather than a link.
              -->
              <RouterLink
                v-if="attempt.user && router.hasRoute('admin-user-level')"
                :to="{ name: 'admin-user-level', params: { id: String(attempt.user.id) } }"
                class="text-ink-100 hover:text-passport-300 block truncate text-sm font-medium"
              >
                {{ attempt.user.firstName }} {{ attempt.user.lastName }}
              </RouterLink>
              <span
                v-else-if="attempt.user"
                class="text-ink-100 block truncate text-sm font-medium"
              >
                {{ attempt.user.firstName }} {{ attempt.user.lastName }}
              </span>
              <span class="text-ink-500 block text-xs">
                Level {{ attempt.levelId }} exam · {{ attempt.when }}
              </span>
            </span>
            <span class="text-right">
              <span class="text-ink-200 block text-sm font-semibold">
                {{ attempt.score }}/{{ attempt.total }}
              </span>
              <span
                class="block text-[11px] font-medium"
                :class="attempt.passed ? 'text-success' : 'text-danger'"
              >
                {{ attempt.passed ? 'Passed' : 'Failed' }}
              </span>
            </span>
          </li>
        </ul>
      </BaseCard>
    </div>
  </div>
</template>
