import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLevelStore } from './levels'
import { useUserStore } from './users'
import type { ELearningItem, ExamAttempt, LevelId, Question, QuestionDraft } from '@/types'
export type ExamQuestionView = Pick<Question, 'id' | 'question' | 'choices'>
export interface ExamOutcome {
  attempt: ExamAttempt
  levelAfter: LevelId
  upgraded: boolean
}

export const useExamStore = defineStore('exam', () => {
  const questions = ref<Question[]>([])
  const lessons = ref<ELearningItem[]>([])
  const attempts = ref<ExamAttempt[]>([])
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

  function hydrate(database: {
    questions: Question[]
    elearning: ELearningItem[]
    examHistory: ExamAttempt[]
  }) {
    questions.value = database.questions.map((question) => ({
      ...question,
      choices: [...question.choices],
    }))
    lessons.value = database.elearning.map((lesson) => ({ ...lesson }))
    attempts.value = database.examHistory.map((attempt) => ({ ...attempt }))
    resetExam()
    lastOutcome.value = null
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
      levelAfter: upgradedTo ?? userStore.byId(userId)?.level ?? levelId,
      upgraded: upgradedTo !== null,
    }
    lastOutcome.value = outcome
    activeLevel.value = null
    answers.value = {}
    return outcome
  }
  function nextQuestionId(): number {
    return Math.max(0, ...questions.value.map((question) => question.id)) + 1
  }
  function addQuestion(levelId: LevelId, draft: QuestionDraft): Question {
    const question: Question = { id: nextQuestionId(), levelId, ...draft }
    questions.value = [...questions.value, question]
    return question
  }
  function updateQuestion(id: number, draft: QuestionDraft) {
    const index = questions.value.findIndex((question) => question.id === id)
    if (index === -1) return
    questions.value[index] = { ...questions.value[index]!, ...draft }
  }
  function removeQuestion(id: number) {
    questions.value = questions.value.filter((question) => question.id !== id)
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
    hydrate,
    startExam,
    answerQuestion,
    resetExam,
    submitExam,
    addQuestion,
    updateQuestion,
    removeQuestion,
  }
})
