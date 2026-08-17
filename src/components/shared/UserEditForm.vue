<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import type { User, UserEditable } from '@/types'

const props = defineProps<{
  user: User
  provinces: string[]
  saving?: boolean
}>()
const emit = defineEmits<{
  save: [values: UserEditable]
  cancel: []
}>()
const form = reactive<UserEditable>(pick(props.user))
function pick(user: User): UserEditable {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    province: user.province,
    bio: user.bio,
  }
}

watch(
  () => props.user.id,
  () => Object.assign(form, pick(props.user)),
)
const errors = computed(() => {
  const found: Partial<Record<keyof UserEditable, string>> = {}
  if (!form.firstName.trim()) found.firstName = 'First name is required'
  if (!form.lastName.trim()) found.lastName = 'Last name is required'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email address'
  if (!/^[\d\s-]+$/.test(form.phone) || form.phone.replace(/\D/g, '').length !== 10)
    found.phone = 'Phone number must contain exactly 10 digits'
  return found
})
const isValid = computed(() => Object.keys(errors.value).length === 0)
function onSubmit() {
  if (!isValid.value) return
  emit('save', { ...form })
}
const fieldClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-passport-400 focus:outline-none'
</script>
<template>
  <form class="space-y-5" novalidate @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="block">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">First name</span>
        <input v-model="form.firstName" :class="fieldClass" autocomplete="given-name" />
        <span v-if="errors.firstName" class="mt-1 block text-xs text-danger">
          {{ errors.firstName }}
        </span>
      </label>
      <label class="block">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Last name</span>
        <input v-model="form.lastName" :class="fieldClass" autocomplete="family-name" />
        <span v-if="errors.lastName" class="mt-1 block text-xs text-danger">
          {{ errors.lastName }}
        </span>
      </label>
      <label class="block">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Email</span>
        <input v-model="form.email" type="email" :class="fieldClass" autocomplete="email" />
        <span v-if="errors.email" class="mt-1 block text-xs text-danger">{{ errors.email }}</span>
      </label>
      <label class="block">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Phone</span>
        <input
          v-model="form.phone"
          :class="fieldClass"
          placeholder="08X XXX XXXX"
          autocomplete="tel"
          inputmode="numeric"
        />
        <span v-if="errors.phone" class="mt-1 block text-xs text-danger">{{ errors.phone }}</span>
      </label>
      <label class="block sm:col-span-2">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Province</span>
        <select v-model="form.province" :class="fieldClass">
          <option v-for="province in provinces" :key="province" :value="province">
            {{ province }}
          </option>
        </select>
      </label>
      <label class="block sm:col-span-2">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">About</span>
        <textarea v-model="form.bio" rows="3" :class="fieldClass" />
      </label>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <BaseButton type="submit" :disabled="!isValid || saving">
        {{ saving ? 'Saving…' : 'Save changes' }}
      </BaseButton>
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
      <span v-if="!isValid" class="text-ink-500 text-xs">
        Fix the highlighted fields to enable saving.
      </span>
    </div>
  </form>
</template>
