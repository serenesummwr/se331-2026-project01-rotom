<script setup lang="ts">
import type { ExamQuestionView } from '@/stores/exam'

defineProps<{
  question: ExamQuestionView
  index: number
  total: number
  selected: number | undefined
}>()
const emit = defineEmits<{ choose: [questionId: number, choiceIndex: number] }>()
</script>
<template>
  <fieldset class="border-border/70 bg-surface/50 rounded-2xl border p-5">
    <legend class="sr-only">Question {{ index + 1 }}</legend>
    <p class="text-primary mb-2 text-xs font-semibold tracking-wide">
      Question {{ index + 1 }} of {{ total }}
      <span v-if="selected === undefined" class="text-muted-foreground ms-1 font-normal"
        >· unanswered</span
      >
    </p>
    <p class="text-foreground text-base leading-snug font-medium">{{ question.question }}</p>
    <div class="mt-4 space-y-2">
      <label
        v-for="(choice, choiceIndex) in question.choices"
        :key="choiceIndex"
        class="flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition"
        :class="
          selected === choiceIndex
            ? 'border-primary/60 bg-primary/10'
            : 'border-border hover:border-border-strong hover:bg-border/30'
        "
      >
        <input
          type="radio"
          class="accent-primary mt-0.5 size-4"
          :name="`question-${question.id}`"
          :value="choiceIndex"
          :checked="selected === choiceIndex"
          @change="emit('choose', question.id, choiceIndex)"
        />
        <span class="text-foreground text-sm leading-relaxed">{{ choice }}</span>
      </label>
    </div>
  </fieldset>
</template>
