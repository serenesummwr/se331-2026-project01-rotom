<script setup lang="ts">
import { ref, watch } from 'vue'
import { Check, CircleQuestionMark, Pencil, Trash2 } from 'lucide-vue-next'
import BaseButton from '@/components/shared/BaseButton.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { Question } from '@/types'

const props = withDefaults(
  defineProps<{
    questions: Question[]
    editable?: boolean
    emptyHint?: string
  }>(),
  { editable: false, emptyHint: undefined },
)
const emit = defineEmits<{ edit: [id: number]; remove: [id: number] }>()

const confirmingId = ref<number | null>(null)

watch(
  () => props.questions,
  () => (confirmingId.value = null),
)
function remove(id: number) {
  emit('remove', id)
  confirmingId.value = null
}
</script>
<template>
  <EmptyState
    v-if="questions.length === 0"
    :icon="CircleQuestionMark"
    title="No questions for this level"
    :hint="emptyHint"
  />
  <ol v-else class="space-y-4">
    <li
      v-for="(question, index) in questions"
      :key="question.id"
      class="border-ink-700/70 bg-ink-900/40 rounded-xl border p-4"
    >
      <div class="flex items-start justify-between gap-3">
        <p class="text-ink-100 text-sm font-medium">
          <span class="text-passport-400 me-1.5">{{ index + 1 }}.</span>
          {{ question.question }}
        </p>
        <div v-if="editable" class="flex shrink-0 items-center gap-1">
          <button
            type="button"
            class="text-ink-400 hover:bg-ink-800 hover:text-ink-100 rounded-lg p-1.5 transition"
            :title="`Edit question ${index + 1}`"
            :aria-label="`Edit question ${index + 1}`"
            @click="emit('edit', question.id)"
          >
            <Pencil class="size-4" :stroke-width="1.75" />
          </button>
          <button
            type="button"
            class="text-ink-400 hover:bg-ink-800 hover:text-danger rounded-lg p-1.5 transition"
            :title="`Delete question ${index + 1}`"
            :aria-label="`Delete question ${index + 1}`"
            @click="confirmingId = question.id"
          >
            <Trash2 class="size-4" :stroke-width="1.75" />
          </button>
        </div>
      </div>
      <ul class="mt-3 space-y-1.5">
        <li
          v-for="(choice, choiceIndex) in question.choices"
          :key="choiceIndex"
          class="flex items-start gap-2 text-xs"
          :class="choiceIndex === question.answerIndex ? 'text-success' : 'text-ink-400'"
        >
          <span class="grid w-4 shrink-0 place-items-center pt-0.5">
            <Check
              v-if="choiceIndex === question.answerIndex"
              class="size-3.5"
              :stroke-width="2.5"
            />
            <span v-else class="bg-ink-600 size-1 rounded-full" />
          </span>
          <span>{{ choice }}</span>
        </li>
      </ul>
      <div
        v-if="confirmingId === question.id"
        class="border-ink-700 bg-ink-900 mt-4 flex flex-wrap items-center gap-3 rounded-lg border p-3"
      >
        <p class="text-ink-200 min-w-0 flex-1 text-xs">
          Delete this question? Members sitting this level will no longer see it.
        </p>
        <BaseButton size="sm" variant="danger" @click="remove(question.id)">
          Yes, delete
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="confirmingId = null">Cancel</BaseButton>
      </div>
    </li>
  </ol>
</template>
