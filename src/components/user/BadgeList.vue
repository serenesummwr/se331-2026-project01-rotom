<script setup lang="ts">
import { Award } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import AppIcon from '@/components/shared/AppIcon.vue'
import type { Badge, LevelId } from '@/types'

defineProps<{
  badges: Badge[]
  currentLevel: LevelId
}>()

const ink: Record<LevelId, string> = {
  1: 'border-level-1 ring-level-1/35 text-level-1 bg-level-1/10',
  2: 'border-level-2 ring-level-2/35 text-level-2 bg-level-2/10',
  3: 'border-level-3 ring-level-3/35 text-level-3 bg-level-3/10',
  4: 'border-level-4 ring-level-4/35 text-level-4 bg-level-4/10',
}

const tilt = [-5, 4, -3, 6, -6, 3]
const lift = [0, 7, -3, 5, -5, 8]
function liftStyle(index: number) {
  return { transform: `translateY(${lift[index % lift.length]}px)` }
}
function ringStyle(index: number, earned: boolean) {
  return { transform: earned ? `rotate(${tilt[index % tilt.length]}deg)` : undefined }
}
</script>
<template>
  <EmptyState v-if="badges.length === 0" :icon="Award" title="No badges defined" />
  <ul v-else class="flex flex-wrap items-start justify-center gap-x-8 gap-y-10 py-2">
    <li
      v-for="(badge, index) in badges"
      :key="badge.id"
      class="flex w-32 flex-col items-center text-center"
      :style="liftStyle(index)"
    >
      <span
        class="grid size-24 shrink-0 place-items-center rounded-full border-[3px] ring-1 ring-inset"
        :class="
          badge.levelId <= currentLevel
            ? ink[badge.levelId]
            : 'border-dashed border-border-strong ring-transparent text-muted-foreground'
        "
        :style="ringStyle(index, badge.levelId <= currentLevel)"
      >
        <span class="flex flex-col items-center gap-1">
          <AppIcon
            :name="badge.icon"
            class="size-6"
            :stroke-width="1.5"
            :class="badge.levelId > currentLevel && 'opacity-30'"
          />
          <span class="text-xs font-bold tracking-[0.15em]">LV{{ badge.levelId }}</span>
        </span>
      </span>
      <span class="text-foreground mt-3 block text-sm font-semibold">{{ badge.name }}</span>
      <span class="text-muted-foreground mt-1 block text-xs leading-relaxed">{{
        badge.description
      }}</span>
      <span
        class="mt-2 inline-block text-xs font-semibold"
        :class="badge.levelId <= currentLevel ? 'text-success' : 'text-muted-foreground'"
      >
        {{ badge.levelId <= currentLevel ? 'Earned' : `Unlocks at Level ${badge.levelId}` }}
      </span>
    </li>
  </ul>
</template>
