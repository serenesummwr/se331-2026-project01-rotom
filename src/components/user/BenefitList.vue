<script setup lang="ts">
import EmptyState from '@/components/shared/EmptyState.vue'
import type { Benefit } from '@/types'

defineProps<{
  benefits: Benefit[]
  locked?: boolean
}>()
</script>

<template>
  <EmptyState v-if="benefits.length === 0" title="No benefits listed for this level" />
  <ul v-else class="divide-ink-700/70 -my-3 divide-y">
    <li
      v-for="benefit in benefits"
      :key="benefit.id"
      class="py-3.5"
      :class="locked ? 'opacity-50' : ''"
    >
      <p class="text-ink-100 text-sm font-semibold">{{ benefit.title }}</p>
      <p class="text-ink-400 mt-0.5 text-xs leading-relaxed">{{ benefit.description }}</p>
    </li>
  </ul>
</template>
