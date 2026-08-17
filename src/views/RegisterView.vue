<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import BaseButton from '@/components/shared/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/users'
import type { UserRegistration } from '@/types'

const auth = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const form = reactive<UserRegistration>({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  province: userStore.provinceOptions[0] ?? '',
  bio: '',
})
const password = ref('')
const confirmPassword = ref('')
const touched = reactive<Record<string, boolean>>({})
function touch(field: string) {
  touched[field] = true
}
const errors = computed(() => {
  const found: Record<string, string> = {}
  const username = form.username.trim()
  if (!username) found.username = 'Choose a username'
  else if (!/^[a-z0-9._-]{3,}$/i.test(username))
    found.username = 'At least 3 characters — letters, numbers, dot, dash or underscore'
  else if (userStore.isUsernameTaken(username)) found.username = 'That username is already taken'
  if (!form.firstName.trim()) found.firstName = 'First name is required'
  if (!form.lastName.trim()) found.lastName = 'Last name is required'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email address'
  if (!/^[\d\s-]+$/.test(form.phone) || form.phone.replace(/\D/g, '').length !== 10)
    found.phone = 'Phone number must contain exactly 10 digits'
  if (!form.province) found.province = 'Pick a province'
  if (password.value.length < 6) found.password = 'Use at least 6 characters'
  if (confirmPassword.value !== password.value) found.confirmPassword = 'The passwords do not match'
  return found
})
const isValid = computed(() => Object.keys(errors.value).length === 0)
const submitted = ref(false)
function errorFor(field: string) {
  return submitted.value || touched[field] ? errors.value[field] : undefined
}
function submit() {
  submitted.value = true
  if (!isValid.value) return
  const user = userStore.register({ ...form })

  auth.login(user.username)
  router.replace({ name: 'user-dashboard' })
}
const fieldClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/70 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-passport-400 focus:outline-none'
</script>
<template>
  <div class="min-h-dvh">
    <main class="flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-xl">
        <RouterLink
          :to="{ name: 'landing' }"
          class="text-ink-400 hover:text-ink-100 mb-8 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft class="size-4" />
          Back
        </RouterLink>
        <h1 class="text-ink-50 text-2xl font-semibold">Open your passport</h1>
        <p class="text-ink-400 mt-1.5 text-sm">
          Register to start at Level 1 — you can sit the upgrade exam whenever you are ready.
        </p>
        <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block sm:col-span-2">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                Username
              </span>
              <input
                v-model="form.username"
                :class="fieldClass"
                placeholder="The name you will sign in with"
                autocomplete="username"
                autofocus
                @blur="touch('username')"
              />
              <span v-if="errorFor('username')" class="text-danger mt-1 block text-xs">
                {{ errorFor('username') }}
              </span>
            </label>
            <label class="block">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                First name
              </span>
              <input
                v-model="form.firstName"
                :class="fieldClass"
                autocomplete="given-name"
                @blur="touch('firstName')"
              />
              <span v-if="errorFor('firstName')" class="text-danger mt-1 block text-xs">
                {{ errorFor('firstName') }}
              </span>
            </label>
            <label class="block">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                Last name
              </span>
              <input
                v-model="form.lastName"
                :class="fieldClass"
                autocomplete="family-name"
                @blur="touch('lastName')"
              />
              <span v-if="errorFor('lastName')" class="text-danger mt-1 block text-xs">
                {{ errorFor('lastName') }}
              </span>
            </label>
            <label class="block">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Email</span>
              <input
                v-model="form.email"
                type="email"
                :class="fieldClass"
                autocomplete="email"
                @blur="touch('email')"
              />
              <span v-if="errorFor('email')" class="text-danger mt-1 block text-xs">
                {{ errorFor('email') }}
              </span>
            </label>
            <label class="block">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Phone</span>
              <input
                v-model="form.phone"
                :class="fieldClass"
                placeholder="08X XXX XXXX"
                inputmode="numeric"
                autocomplete="tel"
                @blur="touch('phone')"
              />
              <span v-if="errorFor('phone')" class="text-danger mt-1 block text-xs">
                {{ errorFor('phone') }}
              </span>
            </label>
            <label class="block sm:col-span-2">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                Province
              </span>
              <select v-model="form.province" :class="fieldClass">
                <option v-for="province in userStore.provinceOptions" :key="province" :value="province">
                  {{ province }}
                </option>
              </select>
            </label>
            <label class="block">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                Password
              </span>
              <input
                v-model="password"
                type="password"
                :class="fieldClass"
                autocomplete="new-password"
                @blur="touch('password')"
              />
              <span v-if="errorFor('password')" class="text-danger mt-1 block text-xs">
                {{ errorFor('password') }}
              </span>
            </label>
            <label class="block">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                Confirm password
              </span>
              <input
                v-model="confirmPassword"
                type="password"
                :class="fieldClass"
                autocomplete="new-password"
                @blur="touch('confirmPassword')"
              />
              <span v-if="errorFor('confirmPassword')" class="text-danger mt-1 block text-xs">
                {{ errorFor('confirmPassword') }}
              </span>
            </label>
            <label class="block sm:col-span-2">
              <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
                About you <span class="text-ink-600">— optional</span>
              </span>
              <textarea
                v-model="form.bio"
                rows="3"
                :class="fieldClass"
                placeholder="What brings you to the Service?"
              />
            </label>
          </div>
          <p class="text-ink-500 text-xs leading-relaxed">
            This is a demo, so your account is only kept until you refresh the page. When you sign
            in, use the username you chose—any password will work.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <BaseButton type="submit" :disabled="submitted && !isValid">
              Create my passport
            </BaseButton>
            <span v-if="submitted && !isValid" class="text-ink-500 text-xs">
              Fix the highlighted fields to continue.
            </span>
          </div>
        </form>
        <p class="border-ink-700/70 text-ink-400 mt-8 border-t pt-6 text-sm">
          Already have a passport?
          <RouterLink :to="{ name: 'login' }" class="text-passport-400 font-semibold">
            Sign in instead
          </RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>