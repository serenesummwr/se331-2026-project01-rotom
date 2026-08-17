<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/shared/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const username = ref('')
const password = ref('')
const error = ref('')
const demoAccounts = [
  { username: 'admin', label: 'Administrator', hint: 'Directory, levels and exams' },
  { username: 'user1', label: 'Tanawat · Level 1', hint: 'Fresh Level 1' },
  { username: 'user2', label: 'Ploy · Level 2', hint: 'Level 2 with history' },
]
function submit() {
  error.value = ''
  const user = auth.login(username.value, password.value)
  if (!user) {
    error.value = `No passport found for “${username.value}”. Try admin, user1 or user2.`
    return
  }
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    router.replace(redirect)
    return
  }
  router.replace({ name: auth.homeRoute })
}
function useDemo(name: string) {
  username.value = name
  password.value = 'anything'
  submit()
}
const fieldClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/70 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-passport-400 focus:outline-none'
</script>
<template>
  <div class="grid min-h-dvh lg:grid-cols-2">
    <aside class="stamp-grid bg-ink-900 hidden flex-col justify-between p-12 lg:flex">
      <RouterLink :to="{ name: 'landing' }" class="flex items-center gap-2.5">
        <span class="text-ink-50 text-lg font-semibold">CAT Passport</span>
      </RouterLink>
      <div>
        <h2 class="text-ink-50 max-w-md text-3xl leading-snug font-semibold">Welcome back.</h2>
        <p class="text-ink-400 mt-4 max-w-md text-sm leading-relaxed">
          Sign in to continue learning, check your progress, or take your next exam.
        </p>
      </div>
      <p class="text-ink-600 text-xs">SE331 · Term Project I</p>
    </aside>
    <!-- Form -->
    <main class="flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm">
        <RouterLink
          :to="{ name: 'landing' }"
          class="text-ink-400 hover:text-ink-100 mb-8 inline-flex items-center gap-2 text-sm lg:invisible"
        >
          <ArrowLeft class="size-4" />
          Back
        </RouterLink>
        <h1 class="text-ink-50 text-2xl font-semibold">Sign in</h1>
        <p class="text-ink-400 mt-1.5 text-sm">Enter your username to open your passport.</p>
        <form class="mt-8 space-y-4" novalidate @submit.prevent="submit">
          <label class="block">
            <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Username</span>
            <input
              v-model="username"
              :class="fieldClass"
              placeholder="admin, user1 or user2"
              autocomplete="username"
              autofocus
            />
          </label>
          <label class="block">
            <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Password</span>
            <input
              v-model="password"
              type="password"
              :class="fieldClass"
              placeholder="Anything at all"
              autocomplete="current-password"
            />
            <span class="text-ink-500 mt-1.5 block text-xs">
              For this demo, any password will work.
            </span>
          </label>
          <p v-if="error" class="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
            {{ error }}
          </p>
          <BaseButton type="submit" class="w-full">Sign in</BaseButton>
        </form>
        <p class="text-ink-400 mt-6 text-sm">
          No passport yet?
          <RouterLink :to="{ name: 'register' }" class="text-passport-400 font-semibold">
            Register for one
          </RouterLink>
        </p>
        <div class="border-ink-700/70 mt-8 border-t pt-6">
          <p class="text-ink-400 mb-3 text-xs tracking-wide uppercase">Demo accounts</p>
          <ul class="space-y-2">
            <li v-for="account in demoAccounts" :key="account.username">
              <button
                type="button"
                class="border-ink-700 hover:border-passport-400/60 hover:bg-ink-800/70 flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-start transition"
                @click="useDemo(account.username)"
              >
                <span>
                  <span class="text-ink-100 block text-sm font-medium">{{ account.username }}</span>
                  <span class="text-ink-500 block text-xs">{{ account.hint }}</span>
                </span>
                <span class="text-ink-500 text-xs">{{ account.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
