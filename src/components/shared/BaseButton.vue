<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    as?: 'button' | 'span'
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false, as: 'button' },
)
const variantClass = computed(
  () =>
    ({
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-primary/20 shadow',
      secondary: 'bg-border text-foreground hover:bg-border-strong border border-border-strong',
      ghost: 'text-muted-foreground hover:text-foreground hover:bg-border/60',
      danger: 'bg-danger/90 text-white hover:bg-danger',
    })[props.variant],
)
const sizeClass = computed(
  () => ({ sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' })[props.size],
)
</script>
<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
    :class="[variantClass, sizeClass]"
  >
    <slot />
  </component>
</template>
