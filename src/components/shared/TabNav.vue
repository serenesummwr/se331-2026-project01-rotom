<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ProfileLink } from '@/types'

defineProps<{
  tabs: (ProfileLink & { params?: Record<string, string> })[]
}>()
</script>
<template>
  <nav class="border-ink-700/70 -mb-px flex gap-1 overflow-x-auto border-b" aria-label="Sub pages">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.label"
      :to="{ name: tab.to.name, params: tab.params }"
      class="text-ink-400 hover:text-ink-100 border-b-2 border-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition"
      exact-active-class="border-passport-400! text-passport-300!"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>
