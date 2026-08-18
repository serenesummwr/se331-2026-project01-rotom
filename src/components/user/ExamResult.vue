<script setup lang="ts">
import { computed } from 'vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import type { ExamAttempt, LevelId } from '@/types'

const props = defineProps<{
  attempt: ExamAttempt
  passCriteria: number
  upgradedTo?: { id: LevelId; name: string } | null
}>()
const percent = computed(() => Math.round((props.attempt.score / props.attempt.total) * 100))
const when = computed(() =>
  new Date(props.attempt.attemptedAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
)
</script>
<template>
  <div
    class="rounded-2xl border p-6 sm:p-8"
    :class="attempt.passed ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5'"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p
          class="text-xs font-semibold tracking-[0.18em] uppercase"
          :class="attempt.passed ? 'text-success' : 'text-danger'"
        >
          {{ attempt.passed ? 'Passed' : 'Not this time' }}
        </p>
        <h2 class="text-foreground mt-2 text-3xl font-bold">
          {{ attempt.score }} / {{ attempt.total }}
          <span class="text-muted-foreground text-xl font-semibold">· {{ percent }}%</span>
        </h2>
        <p class="text-muted-foreground mt-1 text-sm">
          Level {{ attempt.levelId }} exam · pass criteria {{ passCriteria }}%
        </p>
      </div>
      <LevelBadge v-if="upgradedTo" :level="upgradedTo.id" :name="upgradedTo.name" size="lg" />
    </div>
    <div class="mt-6">
      <div class="bg-border-strong relative h-2.5 overflow-hidden rounded-full">
        <div
          class="h-full rounded-full"
          :class="attempt.passed ? 'bg-success' : 'bg-danger'"
          :style="{ width: `${percent}%` }"
        />
        <span
          class="bg-foreground absolute inset-y-0 w-0.5"
          :style="{ left: `${passCriteria}%` }"
          :title="`Pass criteria ${passCriteria}%`"
        />
      </div>
      <p class="text-muted-foreground mt-2 text-xs">
        The marker shows the {{ passCriteria }}% you needed to clear.
      </p>
    </div>
    <p
      v-if="upgradedTo"
      class="border-success/30 text-foreground mt-6 rounded-xl border border-dashed px-4 py-3 text-sm"
    >
      Your passport now reads <strong>{{ upgradedTo.name }}</strong
      >. The benefits, the services and the eLearning track have already changed.
    </p>
    <p v-else-if="!attempt.passed" class="text-muted-foreground mt-6 text-sm leading-relaxed">
      Your level is unchanged. Go back through the track for this level and sit the exam again —
      there is no limit on attempts.
    </p>
    <p class="text-muted-foreground mt-6 text-xs">Recorded {{ when }}</p>
  </div>
</template>
