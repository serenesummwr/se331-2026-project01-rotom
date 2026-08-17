<script setup lang="ts">
import { computed } from 'vue'
import type { LevelId } from '@/types'

const props = withDefaults(
  defineProps<{
    level: LevelId
    name?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { name: '', size: 'md' },
)

const tone = computed(
  () =>
    ({
      1: 'bg-level-1/15 text-level-1 ring-level-1/30',
      2: 'bg-level-2/15 text-level-2 ring-level-2/30',
      3: 'bg-level-3/15 text-level-3 ring-level-3/30',
      4: 'bg-level-4/15 text-level-4 ring-level-4/30',
    })[props.level],
)

const sizeClass = computed(
  () =>
    ({
      sm: 'px-2 py-0.5 text-[11px]',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3.5 py-1.5 text-sm',
    })[props.size],
)
</script>
<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ring-1 ring-inset"
    :class="[tone, sizeClass]"
  >
    <span v-if="name">{{ name }}</span>
    <span v-else class="opacity-70">LV{{ level }}</span>
  </span>
</template>
