import axios from 'axios'
import type { MockDatabase } from '@/types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://my-json-server.typicode.com/serenesummwr/se331-2026-project01-rotom'

const api = axios.create({ baseURL: API_BASE_URL, timeout: 8_000 })

export async function loadMockData(): Promise<MockDatabase> {
  const [users, levels, benefits, services, questions, examHistory, elearning, badges] =
    await Promise.all([
      api.get<MockDatabase['users']>('/users'),
      api.get<MockDatabase['levels']>('/levels'),
      api.get<MockDatabase['benefits']>('/benefits'),
      api.get<MockDatabase['services']>('/services'),
      api.get<MockDatabase['questions']>('/questions'),
      api.get<MockDatabase['examHistory']>('/examHistory'),
      api.get<MockDatabase['elearning']>('/elearning'),
      api.get<MockDatabase['badges']>('/badges'),
    ])

  return {
    users: users.data,
    levels: levels.data,
    benefits: benefits.data,
    services: services.data,
    questions: questions.data,
    examHistory: examHistory.data,
    elearning: elearning.data,
    badges: badges.data,
  }
}
