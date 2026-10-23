<script setup lang="ts">
import axios from "axios";
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { ArrowLeft, UserRound } from "lucide-vue-next";
import BaseButton from "@/components/shared/BaseButton.vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/users";
import type { UserRegistration } from "@/types";

interface ApiError {
  message?: string;
  fieldErrors?: {
    field: string;
    message: string;
  }[];
}

const auth = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const form = reactive<UserRegistration>({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  province: userStore.provinceOptions[0] ?? "",
  bio: "",
});

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const submitted = ref(false);
const accountCreated = ref(false);
const avatarUploadFailed = ref(false)
const uploadingAvatar = ref(false);

const serverError = ref("");
const serverFieldErrors = ref<Record<string, string>>({});
const touched = reactive<Record<string, boolean>>({});

const avatarFile = ref<File | null>(null);
const avatarError = ref("");
const avatarInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref("");

const avatarSize = computed(() => {
  if (!avatarFile.value) return "";

  const size = avatarFile.value.size;

  return size < 1024 * 1024
    ? `${Math.ceil(size / 1024)} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
});

const submitLabel = computed(() => {
  if (uploadingAvatar.value) return "Uploading photo…";
  if (loading.value) return "Please wait…";

  if (accountCreated.value) {
    return avatarFile.value ? "Retry photo upload" : "Continue";
  }

  return "Create my passport";
});

function touch(field: string) {
  touched[field] = true;
}

watch(
  () => ({ ...form, password: password.value }),
  () => {
    serverError.value = "";
    serverFieldErrors.value = {};
  },
);

function releaseAvatarPreview() {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
    avatarPreview.value = "";
  }
}

function removeAvatar() {
  releaseAvatarPreview();
  avatarFile.value = null;
  avatarError.value = "";

  if (avatarInput.value) {
    avatarInput.value.value = "";
  }
}

function chooseAvatar() {
  avatarInput.value?.click();
}

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  avatarError.value = "";

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    avatarError.value = "Please select a JPG or PNG image.";
    input.value = "";
    return;
  }

  if (file.size === 0) {
    avatarError.value = "The selected file is empty.";
    input.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    avatarError.value = "Profile image must not exceed 2 MB.";
    input.value = "";
    return;
  }

  releaseAvatarPreview();

  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);

  input.value = "";
}

function onAvatarPreviewError() {
  removeAvatar();
  avatarError.value = "This image could not be displayed. Please choose another JPG or PNG.";
}

onBeforeUnmount(releaseAvatarPreview);

const errors = computed(() => {
  const found: Record<string, string> = {};
  const username = form.username.trim();

  if (!username) {
    found.username = "Choose a username";
  } else if (!/^[a-z0-9._-]{3,32}$/i.test(username)) {
    found.username = "Use 3–32 letters, numbers, dots, dashes or underscores";
  }

  if (!form.firstName.trim()) {
    found.firstName = "First name is required";
  } else if (form.firstName.length > 100) {
    found.firstName = "Use at most 100 characters";
  }

  if (!form.lastName.trim()) {
    found.lastName = "Last name is required";
  } else if (form.lastName.length > 100) {
    found.lastName = "Use at most 100 characters";
  }

  if (form.email.length > 254 || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    found.email = "Enter a valid email address";
  }

  if (
    form.phone.length > 30 ||
    !/^[\d\s-]+$/.test(form.phone) ||
    form.phone.replace(/\D/g, "").length !== 10
  ) {
    found.phone = "Phone number must contain exactly 10 digits";
  }

  if (!form.province.trim()) {
    found.province = "Pick a province";
  } else if (form.province.length > 100) {
    found.province = "Use at most 100 characters";
  }

  if (password.value.length < 6) {
    found.password = "Use at least 6 characters";
  } else if (new TextEncoder().encode(password.value).length > 72) {
    found.password = "Password must not exceed 72 UTF-8 bytes";
  }

  if (confirmPassword.value !== password.value) {
    found.confirmPassword = "The passwords do not match";
  }

  if (form.bio.length > 1000) {
    found.bio = "Use at most 1000 characters";
  }

  return found;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

function errorFor(field: string) {
  if (!submitted.value && !touched[field]) return undefined;

  return errors.value[field] ?? serverFieldErrors.value[field];
}

async function submit() {
  if (loading.value) return;

  submitted.value = true;
  serverError.value = "";
  serverFieldErrors.value = {};

  if (avatarError.value) return;
  if (!accountCreated.value && !isValid.value) return;

  loading.value = true;
  avatarUploadFailed.value = false;

  try {
    if (!accountCreated.value) {
      await auth.register({
        username: form.username.trim(),
        password: password.value,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone,
        province: form.province,
        bio: form.bio.trim(),
      });

      accountCreated.value = true;
    }

    if (avatarFile.value) {
      uploadingAvatar.value = true;

      try {
        await auth.uploadAvatar(avatarFile.value);
      } catch (cause: unknown) {
        avatarUploadFailed.value = true
        const detail = axios.isAxiosError<ApiError>(cause)
          ? cause.response?.data?.message
          : undefined;

        serverError.value =
          "Your account was created, but the profile photo could not be uploaded. " +
          (detail ? `${detail} ` : "") +
          "Choose a photo and retry, or continue without uploading.";

        return;
      } finally {
        uploadingAvatar.value = false;
      }
    }

    await router.replace({ name: auth.homeRoute });
  } catch (cause: unknown) {
    if (accountCreated.value) {
      serverError.value =
        "Your account was created, but the next page could not be opened. Please try continuing again.";
    } else if (axios.isAxiosError<ApiError>(cause)) {
      const data = cause.response?.data;

      serverError.value = cause.response
        ? data?.message || "Unable to create your account."
        : "Unable to connect to the server. If registration was already processed, try signing in before submitting again.";

      for (const fieldError of data?.fieldErrors ?? []) {
        serverFieldErrors.value[fieldError.field] = fieldError.message;
      }
    } else {
      serverError.value =
        "Unable to complete registration. Please try signing in if your account was created.";
    }
  } finally {
    loading.value = false;
  }
}

async function continueWithoutUpload() {
  if (loading.value) return;

  loading.value = true;

  try {
    await router.replace({ name: auth.homeRoute });
  } catch {
    serverError.value = "Unable to open your passport. Please try again.";
  } finally {
    loading.value = false;
  }
}

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-muted/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
</script>

<template>
  <div class="min-h-dvh">
    <main class="flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-xl">
        <RouterLink
          :to="{ name: 'landing' }"
          class="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft class="size-4" />
          Back
        </RouterLink>

        <h1 class="text-foreground text-2xl font-semibold">Open your passport</h1>

        <p class="text-muted-foreground mt-1.5 text-sm">
          Register to start at Level 1 — you can sit the exam whenever you are ready.
        </p>

        <form class="mt-8 space-y-5" novalidate :aria-busy="loading" @submit.prevent="submit">
          <fieldset class="grid min-w-0 gap-4 sm:grid-cols-2" :disabled="loading || accountCreated">
            <label class="block sm:col-span-2">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Username
              </span>

              <input
                v-model="form.username"
                :class="fieldClass"
                placeholder="The name you will sign in with"
                autocomplete="username"
                autofocus
                :aria-invalid="Boolean(errorFor('username'))"
                @blur="touch('username')"
              />

              <span v-if="errorFor('username')" class="text-danger mt-1 block text-xs">
                {{ errorFor("username") }}
              </span>
            </label>

            <label class="block">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                First name
              </span>

              <input
                v-model="form.firstName"
                :class="fieldClass"
                autocomplete="given-name"
                :aria-invalid="Boolean(errorFor('firstName'))"
                @blur="touch('firstName')"
              />

              <span v-if="errorFor('firstName')" class="text-danger mt-1 block text-xs">
                {{ errorFor("firstName") }}
              </span>
            </label>

            <label class="block">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Last name
              </span>

              <input
                v-model="form.lastName"
                :class="fieldClass"
                autocomplete="family-name"
                :aria-invalid="Boolean(errorFor('lastName'))"
                @blur="touch('lastName')"
              />

              <span v-if="errorFor('lastName')" class="text-danger mt-1 block text-xs">
                {{ errorFor("lastName") }}
              </span>
            </label>

            <label class="block">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Email
              </span>

              <input
                v-model="form.email"
                type="email"
                :class="fieldClass"
                autocomplete="email"
                :aria-invalid="Boolean(errorFor('email'))"
                @blur="touch('email')"
              />

              <span v-if="errorFor('email')" class="text-danger mt-1 block text-xs">
                {{ errorFor("email") }}
              </span>
            </label>

            <label class="block">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Phone
              </span>

              <input
                v-model="form.phone"
                :class="fieldClass"
                placeholder="08X XXX XXXX"
                inputmode="numeric"
                autocomplete="tel"
                :aria-invalid="Boolean(errorFor('phone'))"
                @blur="touch('phone')"
              />

              <span v-if="errorFor('phone')" class="text-danger mt-1 block text-xs">
                {{ errorFor("phone") }}
              </span>
            </label>

            <label class="block sm:col-span-2">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Province
              </span>

              <select
                v-model="form.province"
                :class="fieldClass"
                :aria-invalid="Boolean(errorFor('province'))"
                @blur="touch('province')"
              >
                <option
                  v-for="province in userStore.provinceOptions"
                  :key="province"
                  :value="province"
                >
                  {{ province }}
                </option>
              </select>

              <span v-if="errorFor('province')" class="text-danger mt-1 block text-xs">
                {{ errorFor("province") }}
              </span>
            </label>

            <label class="block">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Password
              </span>

              <input
                v-model="password"
                type="password"
                :class="fieldClass"
                autocomplete="new-password"
                :aria-invalid="Boolean(errorFor('password'))"
                @blur="touch('password')"
              />

              <span v-if="errorFor('password')" class="text-danger mt-1 block text-xs">
                {{ errorFor("password") }}
              </span>
            </label>

            <label class="block">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                Confirm password
              </span>

              <input
                v-model="confirmPassword"
                type="password"
                :class="fieldClass"
                autocomplete="new-password"
                :aria-invalid="Boolean(errorFor('confirmPassword'))"
                @blur="touch('confirmPassword')"
              />

              <span v-if="errorFor('confirmPassword')" class="text-danger mt-1 block text-xs">
                {{ errorFor("confirmPassword") }}
              </span>
            </label>

            <label class="block sm:col-span-2">
              <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
                About you — optional
              </span>

              <textarea
                v-model="form.bio"
                rows="3"
                :class="fieldClass"
                placeholder="Tell us about yourself"
                :aria-invalid="Boolean(errorFor('bio'))"
                @blur="touch('bio')"
              />

              <span v-if="errorFor('bio')" class="text-danger mt-1 block text-xs">
                {{ errorFor("bio") }}
              </span>
            </label>
          </fieldset>

          <section aria-labelledby="avatar-heading">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h2 id="avatar-heading" class="text-foreground text-sm font-medium">Profile photo</h2>

              <span class="text-muted-foreground text-xs"> Optional </span>
            </div>

            <div class="border-border bg-muted/30 rounded-xl border p-4">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  class="border-border bg-surface flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border"
                >
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Selected profile photo preview"
                    class="size-full object-cover"
                    @error="onAvatarPreviewError"
                  />

                  <UserRound
                    v-else
                    class="text-muted-foreground size-9"
                    :stroke-width="1.5"
                    aria-hidden="true"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <BaseButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      :disabled="loading"
                      aria-describedby="avatar-help avatar-error"
                      @click="chooseAvatar"
                    >
                      {{ avatarFile ? "Change photo" : "Choose photo" }}
                    </BaseButton>

                    <BaseButton
                      v-if="avatarFile || avatarError"
                      type="button"
                      variant="ghost"
                      size="sm"
                      class="hover:bg-danger/10 hover:text-danger"
                      :disabled="loading"
                      @click="removeAvatar"
                    >
                      {{ avatarFile ? "Remove" : "Clear" }}
                    </BaseButton>
                  </div>

                  <p id="avatar-help" class="text-muted-foreground mt-2 text-xs">
                    JPG or PNG · Up to 2 MB
                  </p>

                  <p v-if="avatarFile" class="text-muted-foreground mt-1 text-xs break-all">
                    {{ avatarFile.name }} · {{ avatarSize }}
                  </p>
                </div>
              </div>

              <input
                ref="avatarInput"
                type="file"
                accept="image/jpeg,image/png"
                class="hidden"
                :disabled="loading"
                aria-label="Choose profile photo"
                @change="onAvatarChange"
              />
            </div>

            <p id="avatar-error" role="alert" class="text-danger mt-2 text-xs">
              {{ avatarError }}
            </p>
          </section>

          <p
            v-if="serverError"
            role="alert"
            class="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger"
          >
            {{ serverError }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <BaseButton
              type="submit"
              :disabled="loading || (!accountCreated && submitted && !isValid)"
            >
              {{ submitLabel }}
            </BaseButton>

            <BaseButton
              v-if="avatarUploadFailed && !loading"
              type="button"
              variant="secondary"
              :disabled="loading"
              @click="continueWithoutUpload"
            >
              Continue without uploading
            </BaseButton>

            <span
              v-if="!accountCreated && submitted && !isValid"
              class="text-muted-foreground text-xs"
            >
              Fix the highlighted fields to continue.
            </span>
          </div>
        </form>

        <p class="border-border/70 text-muted-foreground mt-8 border-t pt-6 text-sm">
          Already have a passport?

          <RouterLink :to="{ name: 'login' }" class="text-primary font-semibold">
            Sign in instead
          </RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>
