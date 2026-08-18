<script setup lang="ts">
import { Wrench } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { Service } from '@/types'

defineProps<{
  services: Service[]
  locked?: boolean
}>()
</script>
<template>
  <EmptyState
    v-if="services.length === 0"
    :icon="Wrench"
    title="No services listed for this level"
  />
  <ul v-else class="divide-border/70 -my-3 divide-y">
    <li
      v-for="service in services"
      :key="service.id"
      class="py-3.5"
      :class="locked ? 'opacity-50' : ''"
    >
      <p class="text-foreground text-sm font-semibold">{{ service.name }}</p>
      <p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">{{ service.description }}</p>
    </li>
  </ul>
</template>
