<script setup lang="ts">
import { reactive, watch } from 'vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import type { Level, LevelEditable } from '@/types'

const props = defineProps<{ level: Level }>()
const emit = defineEmits<{
  save: [values: LevelEditable]
  cancel: []
}>()
const form = reactive<LevelEditable>(pick(props.level))
function pick(level: Level): LevelEditable {
  return {
    name: level.name,
    tagline: level.tagline,
    description: level.description,
    passCriteria: level.passCriteria,
  }
}
watch(
  () => props.level.id,
  () => Object.assign(form, pick(props.level)),
)
const fieldClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-passport-400 focus:outline-none'
</script>
<template>
  <form class="space-y-5" novalidate @submit.prevent="emit('save', { ...form })">
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="block">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Level name</span>
        <input v-model="form.name" :class="fieldClass" />
      </label>
      <label class="block">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">
          Pass criteria (%)
        </span>
        <input
          v-model.number="form.passCriteria"
          type="number"
          min="0"
          max="100"
          :class="fieldClass"
        />
      </label>
      <label class="block sm:col-span-2">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Tagline</span>
        <input v-model="form.tagline" :class="fieldClass" />
      </label>
      <label class="block sm:col-span-2">
        <span class="text-ink-300 mb-1.5 block text-xs tracking-wide uppercase">Description</span>
        <textarea v-model="form.description" rows="4" :class="fieldClass" />
      </label>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <BaseButton type="submit">Save level</BaseButton>
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
    </div>
  </form>
</template>
