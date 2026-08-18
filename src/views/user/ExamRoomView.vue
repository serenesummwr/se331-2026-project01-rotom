<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import BaseButton from '@/components/shared/BaseButton.vue'
import ExamQuestion from '@/components/user/ExamQuestion.vue'
import ExamQuestionPager from '@/components/user/ExamQuestionPager.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'
import { useExamStore } from '@/stores/exam'

const auth = useAuthStore()
const levelStore = useLevelStore()
const examStore = useExamStore()
const router = useRouter()
const level = computed(() => auth.currentUser?.level ?? 1)
const currentLevel = computed(() => levelStore.levelById(level.value))
const currentIndex = ref(0)
const questions = computed(() => examStore.activeQuestions)
const total = computed(() => questions.value.length)
const question = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value >= total.value - 1)
const answered = computed(() =>
  questions.value.map((item) => examStore.answers[item.id] !== undefined),
)
const progress = computed(() =>
  total.value === 0 ? '0%' : `${(examStore.answeredCount / total.value) * 100}%`,
)

onMounted(() => {
  if (level.value >= 4 || examStore.questionsFor(level.value).length === 0) {
    router.replace({ name: 'user-exam' })
    return
  }
  examStore.startExam(level.value)
})
onBeforeUnmount(() => examStore.resetExam())
function go(index: number) {
  currentIndex.value = Math.min(Math.max(0, index), Math.max(0, total.value - 1))
}
function submit() {
  if (!auth.currentUser) return
  const outcome = examStore.submitExam(auth.currentUser.id)
  if (!outcome) return
  router.replace({ name: 'user-exam-result', params: { attemptId: String(outcome.attempt.id) } })
}
</script>
<template>
  <div class="bg-background min-h-dvh">
    <header class="border-border/70 bg-surface border-b">
      <div class="mx-auto max-w-3xl px-6 py-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <RouterLink
            :to="{ name: 'user-exam' }"
            class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft class="size-4" :stroke-width="1.75" />
            Leave the exam room
          </RouterLink>
          <p class="text-muted-foreground text-xs">Leaving discards this attempt</p>
        </div>
        <div class="mt-5 text-center">
          <p v-if="currentLevel" class="text-muted-foreground text-xs tracking-wide uppercase">
            {{ currentLevel.name }} · pass at {{ currentLevel.passCriteria }}%
          </p>
          <h1 class="text-foreground mt-1 text-lg font-semibold sm:text-xl">
            Level {{ level }} exam ({{ total }} questions)
          </h1>
          <p class="text-foreground mt-4 text-3xl font-bold tabular-nums">
            {{ examStore.answeredCount }}
            <span class="text-muted-foreground text-base font-medium">of {{ total }} answered</span>
          </p>
          <div class="bg-border-strong mx-auto mt-3 h-1.5 max-w-xs overflow-hidden rounded-full">
            <div
              class="bg-primary h-full rounded-full transition-all"
              :style="{ width: progress }"
            />
          </div>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-6 py-8">
      <ExamQuestion
        v-if="question"
        :key="question.id"
        :question="question"
        :index="currentIndex"
        :total="total"
        :selected="examStore.answers[question.id]"
        @choose="examStore.answerQuestion"
      />

      <div class="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span aria-hidden="true" />
        <div class="flex flex-wrap items-center justify-center gap-3">
          <BaseButton v-if="currentIndex > 0" variant="secondary" @click="go(currentIndex - 1)">
            <ArrowLeft class="size-4" :stroke-width="2.5" />
            Previous
          </BaseButton>
          <BaseButton v-if="!isLast" @click="go(currentIndex + 1)">
            Next question
            <ArrowRight class="size-4" :stroke-width="2.5" />
          </BaseButton>
        </div>
        <div class="flex justify-end">
          <BaseButton v-if="examStore.isComplete" @click="submit">Submit the exam</BaseButton>
        </div>
      </div>
      <ExamQuestionPager
        class="mt-8"
        :total="total"
        :current="currentIndex"
        :answered="answered"
        @go="go"
      />
    </main>
  </div>
</template>
