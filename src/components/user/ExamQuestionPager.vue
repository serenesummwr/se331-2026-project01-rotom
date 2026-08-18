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
          ? 'bg-primary text-primary-foreground border-primary'
          : answered[number - 1]
            ? 'border-primary/50 text-primary-hover hover:border-primary'
            : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground'
      "
      :aria-current="number - 1 === current ? 'step' : undefined"
      :aria-label="`Question ${number}${answered[number - 1] ? ', answered' : ', not answered'}`"
      @click="emit('go', number - 1)"
    >
      {{ number }}
    </button>
  </nav>
</template>
