<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ProfileTab } from '@/types'

defineProps<{
  tabs: ProfileTab[]
}>()
</script>
<template>
  <nav class="border-border/70 -mb-px flex gap-1 overflow-x-auto border-b" aria-label="Sub pages">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.label"
      :to="{ name: tab.to.name, params: tab.params }"
      class="text-muted-foreground hover:text-foreground border-b-2 border-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition"
      exact-active-class="border-primary! text-primary-hover!"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>
