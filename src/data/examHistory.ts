import { users } from './users'
import { levels } from './levels'
import type { ExamAttempt, LevelId } from '@/types'

const QUESTIONS_PER_EXAM = 5
function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
function passMark(levelId: LevelId): number {
  const criteria = levels.find((level) => level.id === levelId)?.passCriteria ?? 60
  return Math.ceil((criteria / 100) * QUESTIONS_PER_EXAM)
}
function daysBefore(iso: string, days: number): string {
  const date = new Date(iso)
  date.setDate(date.getDate() + days)
  date.setHours(10 + (days % 8), (days * 7) % 60, 0, 0)
  return date.toISOString()
}
const attempts: ExamAttempt[] = []
let nextId = 1
for (const user of users) {
  let offset = 21
  for (let level = 1; level < user.level; level += 1) {
    const levelId = level as LevelId
    const needed = passMark(levelId)
    if (seeded(user.id * 10 + level) < 0.34) {
      attempts.push({
        id: nextId++,
        userId: user.id,
        levelId,
        score: Math.max(0, needed - 1 - Math.floor(seeded(user.id + level) * 2)),
        total: QUESTIONS_PER_EXAM,
        passed: false,
        attemptedAt: daysBefore(user.joinedAt, offset),
      })
      offset += 6
    }
    attempts.push({
      id: nextId++,
      userId: user.id,
      levelId,
      score: needed + Math.floor(seeded(user.id * level + 3) * (QUESTIONS_PER_EXAM - needed + 1)),
      total: QUESTIONS_PER_EXAM,
      passed: true,
      attemptedAt: daysBefore(user.joinedAt, offset),
    })
    offset += 34
  }

  if (user.level < 4 && seeded(user.id * 3.7) < 0.4) {
    attempts.push({
      id: nextId++,
      userId: user.id,
      levelId: user.level,
      score: Math.max(0, passMark(user.level) - 1),
      total: QUESTIONS_PER_EXAM,
      passed: false,
      attemptedAt: daysBefore(user.joinedAt, offset),
    })
  }
}
export const examHistory: ExamAttempt[] = attempts.sort(
  (a, b) => Date.parse(b.attemptedAt) - Date.parse(a.attemptedAt),
)