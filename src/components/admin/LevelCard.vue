<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import type { Level } from '@/types'

defineProps<{
  level: Level
  benefitCount: number
  serviceCount: number
  questionCount: number
  memberCount: number
}>()
</script>
<template>
  <article
    class="border-border/70 bg-surface/60 hover:border-primary/40 rounded-2xl border p-6 transition"
  >
    <div class="flex flex-wrap items-start justify-between gap-3">
      <LevelBadge :level="level.id" :name="level.name" size="lg" />
      <span class="text-muted-foreground text-xs">{{ memberCount }} members</span>
    </div>
    <p class="text-foreground mt-4 text-sm font-medium">{{ level.tagline }}</p>
    <p class="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
      {{ level.description }}
    </p>
    <dl class="border-border mt-5 grid grid-cols-3 gap-3 border-t pt-4 text-center">
      <div>
        <dt class="text-muted-foreground text-xs tracking-wide uppercase">Benefits</dt>
        <dd class="text-foreground mt-0.5 text-lg font-semibold">{{ benefitCount }}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground text-xs tracking-wide uppercase">Services</dt>
        <dd class="text-foreground mt-0.5 text-lg font-semibold">{{ serviceCount }}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground text-xs tracking-wide uppercase">Questions</dt>
        <dd class="text-foreground mt-0.5 text-lg font-semibold">{{ questionCount }}</dd>
      </div>
    </dl>
    <div class="mt-5 flex items-center justify-between">
      <span class="text-muted-foreground text-xs">Pass criteria {{ level.passCriteria }}%</span>
      <RouterLink
        :to="{ name: 'admin-level-detail', params: { id: String(level.id) } }"
        class="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-xs font-semibold"
      >
        Open level
        <ChevronRight class="size-3.5" :stroke-width="2.5" />
      </RouterLink>
    </div>
  </article>
</template>
