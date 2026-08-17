<script setup lang="ts">
defineProps<{
  total: number
  current: number
  answered: boolean[]
}>()
const emit = defineEmits<{ go: [index: number] }>()
</script>
<template>
  <nav class="flex flex-wrap items-center justify-center gap-2" aria-label="Questions">
    <button
      v-for="number in total"
      :key="number"
      type="button"
      class="size-10 rounded-xl border text-sm font-semibold transition"
      :class="
        number - 1 === current
          ? 'bg-passport-400 text-accent-fg border-passport-400'
          : answered[number - 1]
            ? 'border-passport-400/50 text-passport-300 hover:border-passport-400'
            : 'border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-100'
      "
      :aria-current="number - 1 === current ? 'step' : undefined"
      :aria-label="`Question ${number}${answered[number - 1] ? ', answered' : ', not answered'}`"
      @click="emit('go', number - 1)"
    >
      {{ number }}
    </button>
  </nav>
</template>
