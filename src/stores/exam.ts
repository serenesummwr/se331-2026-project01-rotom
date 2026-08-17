import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { questions as seedQuestions } from '@/data/questions'
import { elearning } from '@/data/elearning'
import { examHistory } from '@/data/examHistory'
import { useLevelStore } from './levels'
import { useUserStore } from './users'
import type { ELearningItem, ExamAttempt, LevelId, Question } from '@/types'
export type ExamQuestionView = Pick<Question, 'id' | 'question' | 'choices'>
export interface ExamOutcome {
  attempt: ExamAttempt
  levelAfter: LevelId
  upgraded: boolean
}

export const useExamStore = defineStore('exam', () => {
  const questions = ref<Question[]>([...seedQuestions])
  const lessons = ref<ELearningItem[]>([...elearning])
  const attempts = ref<ExamAttempt[]>([...examHistory])
  const answers = ref<Record<number, number>>({})
  const activeLevel = ref<LevelId | null>(null)
  const lastOutcome = ref<ExamOutcome | null>(null)
  const questionsFor = computed(
    () => (levelId: LevelId) => questions.value.filter((question) => question.levelId === levelId),
  )
  const lessonsFor = computed(
    () => (levelId: LevelId) => lessons.value.filter((lesson) => lesson.levelId === levelId),
  )
  const historyFor = computed(
    () => (userId: number) =>
      attempts.value
        .filter((attempt) => attempt.userId === userId)
        .sort((a, b) => Date.parse(b.attemptedAt) - Date.parse(a.attemptedAt)),
  )
  const attemptById = computed(
    () => (id: number) => attempts.value.find((attempt) => attempt.id === id),
  )
  const activeQuestions = computed<ExamQuestionView[]>(() =>
    activeLevel.value === null
      ? []
      : questionsFor.value(activeLevel.value).map(({ id, question, choices }) => ({
          id,
          question,
          choices,
        })),
  )
  const answeredCount = computed(() => Object.keys(answers.value).length)
  const isComplete = computed(
    () => activeQuestions.value.length > 0 && answeredCount.value === activeQuestions.value.length,
  )
  function startExam(levelId: LevelId) {
    activeLevel.value = levelId
    answers.value = {}
    lastOutcome.value = null
  }
  function answerQuestion(questionId: number, choiceIndex: number) {
    answers.value = { ...answers.value, [questionId]: choiceIndex }
  }
  function resetExam() {
    activeLevel.value = null
    answers.value = {}
  }
 
  function submitExam(userId: number): ExamOutcome | null {
    if (activeLevel.value === null || !isComplete.value) return null
    const levelId = activeLevel.value
    const paper = questionsFor.value(levelId)
    const score = paper.reduce(
      (total, question) => total + (answers.value[question.id] === question.answerIndex ? 1 : 0),
      0,
    )
    const levelStore = useLevelStore()
    const userStore = useUserStore()
    const percent = (score / paper.length) * 100
    const passed = percent >= levelStore.passCriteriaFor(levelId)
    const attempt: ExamAttempt = {
      id: Math.max(0, ...attempts.value.map((a) => a.id)) + 1,
      userId,
      levelId,
      score,
      total: paper.length,
      passed,
      attemptedAt: new Date().toISOString(),
    }
    attempts.value = [attempt, ...attempts.value]
    const upgradedTo = passed ? userStore.upgradeLevel(userId) : null
    const outcome: ExamOutcome = {
      attempt,
      levelAfter: upgradedTo ?? (userStore.byId(userId)?.level ?? levelId),
      upgraded: upgradedTo !== null,
    }
    lastOutcome.value = outcome
    activeLevel.value = null
    answers.value = {}
    return outcome
  }
  return {
    questions,
    lessons,
    attempts,
    answers,
    activeLevel,
    lastOutcome,
    questionsFor,
    lessonsFor,
    historyFor,
    attemptById,
    activeQuestions,
    answeredCount,
    isComplete,
    startExam,
    answerQuestion,
    resetExam,
    submitExam,
  }
})