<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import BaseButton from '@/components/shared/BaseButton.vue'
import type { Question, QuestionDraft } from '@/types'
const MIN_CHOICES = 2
const MAX_CHOICES = 6

const props = defineProps<{
  question?: Question
  levelName: string
}>()
const emit = defineEmits<{
  save: [draft: QuestionDraft]
  cancel: []
}>()
const form = reactive<QuestionDraft>(pick(props.question))
function pick(question?: Question): QuestionDraft {
  if (!question) return { question: '', choices: ['', '', '', ''], answerIndex: -1 }
  return {
    question: question.question,
    choices: [...question.choices],
    answerIndex: question.answerIndex,
  }
}
watch(
  () => props.question?.id,
  () => Object.assign(form, pick(props.question)),
)
const filledChoices = computed(() => form.choices.filter((choice) => choice.trim() !== '').length)
const errors = computed(() => {
  const found: { question?: string; choices?: string; answer?: string } = {}
  if (!form.question.trim()) found.question = 'Write the question'
  if (filledChoices.value < MIN_CHOICES) found.choices = `Give at least ${MIN_CHOICES} choices`

  const answer = form.choices[form.answerIndex]
  if (form.answerIndex < 0) found.answer = 'Mark the correct answer'
  else if (!answer || !answer.trim()) found.answer = 'The correct answer is blank'
  return found
})
const isValid = computed(() => Object.keys(errors.value).length === 0)
function addChoice() {
  if (form.choices.length < MAX_CHOICES) form.choices.push('')
}

function removeChoice(index: number) {
  if (form.choices.length <= MIN_CHOICES) return
  form.choices.splice(index, 1)
  if (form.answerIndex === index) form.answerIndex = -1
  else if (form.answerIndex > index) form.answerIndex -= 1
}

function submit() {
  if (!isValid.value) return
  const choices: string[] = []
  let answerIndex = -1
  form.choices.forEach((choice, index) => {
    const text = choice.trim()
    if (text === '') return
    if (index === form.answerIndex) answerIndex = choices.length
    choices.push(text)
  })
  emit('save', { question: form.question.trim(), choices, answerIndex })
}
const fieldClass =
  'w-full rounded-lg border border-border-strong bg-muted/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none'
</script>
<template>
  <form
    class="border-primary/30 bg-muted/40 space-y-5 rounded-xl border p-5"
    novalidate
    @submit.prevent="submit"
  >
    <div>
      <h3 class="text-foreground text-sm font-semibold">
        {{ question ? 'Edit question' : 'New question' }}
      </h3>
      <p class="text-muted-foreground mt-0.5 text-xs">
        {{ levelName }} upgrade exam · members see the choices in this order
      </p>
    </div>
    <label class="block">
      <span class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase"
        >Question</span
      >
      <textarea
        v-model="form.question"
        rows="2"
        :class="fieldClass"
        placeholder="What happens the moment you register?"
      />
      <span v-if="errors.question" class="text-danger mt-1 block text-xs">
        {{ errors.question }}
      </span>
    </label>
    <fieldset>
      <legend class="text-muted-foreground mb-1.5 block text-xs tracking-wide uppercase">
        Choices — select the correct one
      </legend>
      <div class="space-y-2">
        <div v-for="(_, index) in form.choices" :key="index" class="flex items-center gap-2.5">
          <input
            v-model="form.answerIndex"
            type="radio"
            :value="index"
            :aria-label="`Choice ${index + 1} is correct`"
            class="accent-primary size-4 shrink-0"
          />
          <input
            v-model="form.choices[index]"
            :class="fieldClass"
            :placeholder="`Choice ${index + 1}`"
          />
          <button
            type="button"
            class="text-muted-foreground hover:bg-surface hover:text-danger shrink-0 rounded-lg p-1.5 transition disabled:pointer-events-none disabled:opacity-30"
            :disabled="form.choices.length <= MIN_CHOICES"
            :title="`Remove choice ${index + 1}`"
            :aria-label="`Remove choice ${index + 1}`"
            @click="removeChoice(index)"
          >
            <X class="size-4" :stroke-width="1.75" />
          </button>
        </div>
      </div>
      <div class="mt-2.5 flex flex-wrap items-center gap-3">
        <BaseButton
          v-if="form.choices.length < MAX_CHOICES"
          type="button"
          size="sm"
          variant="ghost"
          @click="addChoice"
        >
          <Plus class="size-3.5" :stroke-width="2.5" />
          Add a choice
        </BaseButton>
        <span v-if="errors.choices" class="text-danger text-xs">{{ errors.choices }}</span>
        <span v-else-if="errors.answer" class="text-danger text-xs">{{ errors.answer }}</span>
      </div>
    </fieldset>
    <div class="flex flex-wrap items-center gap-3">
      <BaseButton type="submit" :disabled="!isValid">
        {{ question ? 'Save question' : 'Add question' }}
      </BaseButton>
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
    </div>
  </form>
</template>
