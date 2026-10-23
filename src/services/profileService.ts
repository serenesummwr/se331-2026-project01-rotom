import { api } from '@/services/api'
import type { User, UserEditable } from '@/types'

export const profileService = {
  async updateMe(
    values: UserEditable,
    accessToken: string,
  ): Promise<User> {
    const response = await api.put<User>(
      '/me',
      values,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    return response.data
  },

  async uploadAvatar(
    file: File,
    accessToken: string,
  ): Promise<User> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.put<User>(
      '/me/avatar',
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    return response.data
  },
}