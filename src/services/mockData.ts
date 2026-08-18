import axios from 'axios'
import databaseUrl from '../../db.json?url'
import type { MockDatabase } from '@/types'

export async function loadMockData(): Promise<MockDatabase> {
  const response = await axios.get<MockDatabase>(databaseUrl)
  return response.data
}
