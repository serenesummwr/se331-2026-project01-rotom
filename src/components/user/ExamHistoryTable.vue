<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import type { ExamAttempt } from '@/types'

defineProps<{ attempts: ExamAttempt[] }>()
function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
<template>
  <EmptyState
    v-if="attempts.length === 0"
    :icon="FileText"
    title="No exam attempts yet"
    hint="Attempts appear here as soon as an exam is submitted."
  />
  <ul v-else class="divide-ink-700 -my-3 divide-y">
    <li
      v-for="attempt in attempts"
      :key="attempt.id"
      class="flex flex-wrap items-center gap-3 py-3"
    >
      <LevelBadge :level="attempt.levelId" size="sm" />
      <span class="min-w-0 flex-1">
        <span class="text-ink-100 block text-sm font-medium">
          Level {{ attempt.levelId }} exam
        </span>
        <span class="text-ink-500 block text-xs">{{ formatWhen(attempt.attemptedAt) }}</span>
      </span>
      <span class="text-ink-200 text-sm font-semibold tabular-nums">
        {{ attempt.score }}/{{ attempt.total }}
      </span>
      <span
        class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
        :class="attempt.passed ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
      >
        {{ attempt.passed ? 'Passed' : 'Failed' }}
      </span>
    </li>
  </ul>
</template>
