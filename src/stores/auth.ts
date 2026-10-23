import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/services/tokenStorage";
import type { Role, User, UserEditable } from "@/types";
import type { LoginResponse, RegisterRequest } from "@/types/auth";
import { profileService } from "@/services/profileService";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<User | null>(null);

  let sessionVersion = 0;

  function getSessionVersion(): number {
    return sessionVersion;
  }

  const currentUserId = computed(() => currentUser.value?.id ?? null);

  const isAuthenticated = computed(() => currentUser.value !== null);

  const role = computed<Role | null>(() => currentUser.value?.role ?? null);

  const isAdmin = computed(() => role.value === "admin");

  const homeRoute = computed(() => (isAdmin.value ? "admin-dashboard" : "user-dashboard"));

  function applySession(response: LoginResponse): void {
    tokenStorage.write({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });

    sessionVersion += 1;
    currentUser.value = response.user;
  }

  function acceptRefreshedSession(response: LoginResponse): void {
    currentUser.value = response.user;
  }

  function clearSession(): void {
    sessionVersion += 1;

    tokenStorage.clear();
    currentUser.value = null;

    sessionStorage.removeItem("catpassport.session");
  }

  async function login(username: string, password: string): Promise<User> {
    const response = await authService.login({
      username: username.trim(),
      password,
    });

    applySession(response);

    return response.user;
  }

  async function register(request: RegisterRequest): Promise<User> {
    const response = await authService.register(request);

    applySession(response);

    return response.user;
  }

  async function uploadAvatar(file: File): Promise<User> {
    const userId = currentUser.value?.id;

    if (!tokenStorage.read() || userId === undefined) {
      throw new Error("Please sign in before uploading an image.");
    }

    const version = sessionVersion;
    const updatedUser = await profileService.uploadAvatar(file);

    if (sessionVersion === version && currentUser.value?.id === userId) {
      currentUser.value = updatedUser;
    }

    return updatedUser;
  }

  async function updateProfile(values: UserEditable): Promise<User> {
    const userId = currentUser.value?.id;

    if (!tokenStorage.read() || userId === undefined) {
      throw new Error("Please sign in before editing your profile.");
    }

    const version = sessionVersion;
    const updatedUser = await profileService.updateMe(values);

    if (sessionVersion === version && currentUser.value?.id === userId) {
      currentUser.value = updatedUser;
    }

    return updatedUser;
  }

  async function restore(): Promise<void> {
    if (!tokenStorage.read()) {
      currentUser.value = null;
      return;
    }

    const version = sessionVersion;

    try {
      const user = await authService.getMe();

      if (sessionVersion === version) {
        currentUser.value = user;
      }
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        if (sessionVersion === version) {
          clearSession();
        }

        return;
      }

      throw error;
    }
  }

  async function logout(): Promise<void> {
    const version = sessionVersion;

    try {
      if (tokenStorage.read()) {
        await authService.logout();
      }
    } finally {
      if (sessionVersion === version) {
        clearSession();
      }
    }
  }

  return {
    currentUser,
    currentUserId,
    isAuthenticated,
    role,
    isAdmin,
    homeRoute,
    login,
    logout,
    register,
    restore,
    uploadAvatar,
    updateProfile,
    getSessionVersion,
    acceptRefreshedSession,
    clearSession,
  };
});
