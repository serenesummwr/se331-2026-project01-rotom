import { api } from "@/services/api";
import type { User } from "@/types";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

export const authService = {
  async register(request: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", request);
    return response.data;
  },

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", request);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>("/me");
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
