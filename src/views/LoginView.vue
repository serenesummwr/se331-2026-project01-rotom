<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import BaseButton from "@/components/shared/BaseButton.vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  if (loading.value) return;

  error.value = "";

  if (!username.value.trim() || !password.value) {
    error.value = "Please enter your username and password.";
    return;
  }

  loading.value = true;

  try {
    await auth.login(username.value, password.value);

    const redirect = route.query.redirect;

    if (typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")) {
      await router.replace(redirect);
    } else {
      await router.replace({ name: auth.homeRoute });
    }
  } catch (cause: unknown) {
    if (axios.isAxiosError<{ message?: string }>(cause)) {
      error.value = cause.response
        ? cause.response.data?.message || "Unable to sign in."
        : "Unable to connect to the server. Please try again.";
    } else {
      error.value = "Unable to complete sign in. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-muted/70 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
</script>
<template>
  <div class="grid min-h-dvh lg:grid-cols-2">
    <aside class="stamp-grid bg-muted hidden flex-col justify-between p-12 lg:flex">
      <RouterLink :to="{ name: 'landing' }" class="flex items-center gap-2.5">
        <span class="text-foreground text-lg font-semibold">CAT Passport</span>
      </RouterLink>
      <div>
        <h2 class="text-foreground max-w-md text-3xl leading-snug font-semibold">Welcome back.</h2>
        <p class="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed">
          Sign in to continue learning, check your progress, or take your next exam.
        </p>
      </div>
      <p class="text-muted-foreground text-xs">SE331 · Term Project I</p>
    </aside>
    <!-- Form -->
    <main class="flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm">
        <RouterLink
          :to="{ name: 'landing' }"
          class="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm lg:invisible"
        >
          <ArrowLeft class="size-4" />
          Back
        </RouterLink>
        <h1 class="text-foreground text-2xl font-semibold">Sign in</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">
          Enter your username to open your passport.
        </p>
        <form class="mt-8 space-y-4" novalidate @submit.prevent="submit">
          <label class="block">
            <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase"
              >Username</span
            >
            <input
              v-model="username"
              :class="fieldClass"
              placeholder="Enter your username"
              autocomplete="username"
              autofocus
            />
          </label>
          <label class="block">
            <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase"
              >Password</span
            >
            <input
              v-model="password"
              type="password"
              :class="fieldClass"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </label>
          <p v-if="error" class="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
            {{ error }}
          </p>
          <BaseButton type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Signing in…" : "Sign in" }}
          </BaseButton>
        </form>
        <p class="text-muted-foreground mt-6 text-sm">
          No passport yet?
          <RouterLink :to="{ name: 'register' }" class="text-primary font-semibold">
            Register for one
          </RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>
