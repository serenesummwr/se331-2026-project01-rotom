import { api } from "@/services/api";
import type { User, UserEditable } from "@/types";

export const profileService = {
  async updateMe(values: UserEditable): Promise<User> {
    const response = await api.put<User>("/me", values);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.put<User>("/me/avatar", formData);
    return response.data;
  },
};
