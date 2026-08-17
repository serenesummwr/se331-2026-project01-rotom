<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CircleQuestionMark, PencilLine, Stamp, Trophy } from 'lucide-vue-next'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ExamHistoryTable from '@/components/user/ExamHistoryTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'
import { useExamStore } from '@/stores/exam'

const auth = useAuthStore()
const levelStore = useLevelStore()
const examStore = useExamStore()
const router = useRouter()
const level = computed(() => auth.currentUser?.level ?? 1)
const currentLevel = computed(() => levelStore.levelById(level.value))
const nextLevel = computed(() => levelStore.nextLevel(level.value))
const canUpgrade = computed(() => level.value < 4)
const questions = computed(() => examStore.questionsFor(level.value))
const hasPaper = computed(() => questions.value.length > 0)
const history = computed(() => (auth.currentUser ? examStore.historyFor(auth.currentUser.id) : []))
const stats = computed(() => [
  {
    icon: CircleQuestionMark,
    value: String(questions.value.length),
    label: 'questions',
  },
  {
    icon: Trophy,
    value: `${levelStore.passCriteriaFor(level.value)}%`,
    label: 'pass criteria',
  },
  {
    icon: Stamp,
    value: nextLevel.value?.name ?? '—',
    label: 'unlocked by a pass',
  },
])
function start() {
  router.push({ name: 'user-exam-room' })
}
</script>
<template>
  <div class="space-y-8">
    <BaseCard
      v-if="!canUpgrade"
      title="There is no exam beyond Level 4"
      subtitle="You already hold the final level of the passport"
    >
      <RouterLink :to="{ name: 'user-dashboard' }">
        <BaseButton as="span" variant="secondary">Back to my passport</BaseButton>
      </RouterLink>
    </BaseCard>
    <template v-else-if="currentLevel">
      <BaseCard>
        <p class="text-passport-400 text-xs font-semibold tracking-[0.18em] uppercase">
          Level {{ currentLevel.id }} exam
        </p>
        <h2 class="text-ink-50 mt-2 text-2xl font-bold sm:text-3xl">
          {{ currentLevel.name }} → {{ nextLevel?.name }}
        </h2>
        <p class="text-ink-400 mt-6 text-xs tracking-wide uppercase">Instructions</p>
        <ul class="text-ink-300 mt-2 space-y-1.5 text-sm leading-relaxed">
          <li class="flex gap-2.5">
            <span class="text-passport-400 shrink-0" aria-hidden="true">•</span>
            <span>
              {{ questions.length }} multiple-choice question{{
                questions.length === 1 ? '' : 's'
              }}
              — all must be answered before submitting
            </span>
          </li>
          <li class="flex gap-2.5">
            <span class="text-passport-400 shrink-0" aria-hidden="true">•</span>
            <span>
              Score {{ currentLevel.passCriteria }}% or higher to move up to
              <strong class="text-ink-100">{{ nextLevel?.name }}</strong> immediately
            </span>
          </li>
          <li class="flex gap-2.5">
            <span class="text-passport-400 shrink-0" aria-hidden="true">•</span>
            <span>Below {{ currentLevel.passCriteria }}%: your passport stays unchanged</span>
          </li>
          <li class="flex gap-2.5">
            <span class="text-passport-400 shrink-0" aria-hidden="true">•</span>
            <span>
              No time limit, no cap on attempts, and the eLearning track is not a prerequisite
            </span>
          </li>
        </ul>
        <p class="text-ink-400 mt-6 text-xs tracking-wide uppercase">Track</p>
        <p class="text-ink-300 mt-2 text-sm">
          {{ currentLevel.name }} —
          <RouterLink :to="{ name: 'user-elearning' }" class="text-passport-400 font-semibold">
            study the material first
          </RouterLink>
        </p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="border-ink-700/70 bg-ink-900/40 flex items-start gap-3.5 rounded-2xl border p-5"
          >
            <component
              :is="stat.icon"
              class="text-passport-400 mt-0.5 size-8 shrink-0"
              :stroke-width="1.5"
            />
            <div class="min-w-0">
              <p class="text-ink-50 truncate text-xl font-bold">{{ stat.value }}</p>
              <p class="text-ink-300 text-xs font-medium">{{ stat.label }}</p>
            </div>
          </div>
        </div>
        <EmptyState
            v-if="!hasPaper"
            class="mt-6"
            :icon="CircleQuestionMark"
            title="This exam has no questions yet"
            hint="An administrator has not written the paper for this level. Nothing to sit for now — try the eLearning track and come back."
        />
        <div v-else class="mt-12 mb-7 text-center">
          <BaseButton class="gap-3 rounded-xl px-14 py-5 text-lg" @click="start">
            <PencilLine class="size-5" :stroke-width="2.5" />
            Start the exam
          </BaseButton>
        </div>
      </BaseCard>
    </template>
    <BaseCard
      title="Exam history"
      :subtitle="`${history.length} attempt${history.length === 1 ? '' : 's'} on record`"
    >
      <ExamHistoryTable :attempts="history" />
    </BaseCard>
  </div>
</template>
