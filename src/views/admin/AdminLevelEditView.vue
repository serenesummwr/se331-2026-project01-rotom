<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import { ArrowLeft, Layers, Plus } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import LevelEditForm from '@/components/admin/LevelEditForm.vue'
import QuestionList from '@/components/admin/QuestionList.vue'
import QuestionEditForm from '@/components/admin/QuestionEditForm.vue'
import { useLevelStore } from '@/stores/levels'
import { useExamStore } from '@/stores/exam'
import type { LevelEditable, LevelId, QuestionDraft } from '@/types'

const props = defineProps<{ id: string }>()
const levelStore = useLevelStore()
const examStore = useExamStore()
const router = useRouter()
const levelId = computed(() => Number(props.id) as LevelId)
const level = computed(() => levelStore.levelById(levelId.value))
const saved = ref(false)
function save(values: LevelEditable) {
  levelStore.updateLevel(levelId.value, values)
  saved.value = true
}
function cancel() {
  router.push({ name: 'admin-level-detail', params: { id: props.id } })
}
const questions = computed(() => examStore.questionsFor(levelId.value))
const editing = ref<number | 'new' | null>(null)
const editingQuestion = computed(() =>
  typeof editing.value === 'number'
    ? questions.value.find((question) => question.id === editing.value)
    : undefined,
)
function saveQuestion(draft: QuestionDraft) {
  if (editing.value === 'new') examStore.addQuestion(levelId.value, draft)
  else if (typeof editing.value === 'number') examStore.updateQuestion(editing.value, draft)
  editing.value = null
}
function removeQuestion(id: number) {
  examStore.removeQuestion(id)
  if (editing.value === id) editing.value = null
}
</script>
<template>
  <div v-if="level" class="space-y-5">
    <RouterLink
      :to="{ name: 'admin-level-detail', params: { id } }"
      class="text-ink-400 hover:text-ink-100 inline-flex items-center gap-1.5 text-sm"
    >
      <ArrowLeft class="size-4" :stroke-width="1.75" />
      Back to {{ level.name }}
    </RouterLink>
    <BaseCard
      :title="`Edit Level ${level.id}`"
      subtitle="Name, tagline, description and the pass criteria for the upgrade exam"
    >
      <p
        v-if="saved"
        class="bg-success/10 text-success mb-5 rounded-lg px-3.5 py-2.5 text-xs font-medium"
      >
        Saved. The landing page, the member dashboards and the exam pass mark all read this level
        from the same store, so they are already showing the new values.
      </p>
      <LevelEditForm :level="level" @save="save" @cancel="cancel" />
    </BaseCard>
    <BaseCard
      title="Exam questions"
      :subtitle="`${questions.length} question${questions.length === 1 ? '' : 's'} · a member must score ${level.passCriteria}% of them to pass`"
    >
      <template #actions>
        <BaseButton v-if="editing !== 'new'" size="sm" variant="secondary" @click="editing = 'new'">
          <Plus class="size-3.5" :stroke-width="2.5" />
          Add question
        </BaseButton>
      </template>
      <QuestionEditForm
        v-if="editing !== null"
        :key="String(editing)"
        :question="editingQuestion"
        :level-name="level.name"
        class="mb-5"
        @save="saveQuestion"
        @cancel="editing = null"
      />
      <QuestionList
        :questions="questions"
        editable
        empty-hint="Add the first question and members will see it the next time they sit this exam."
        @edit="editing = $event"
        @remove="removeQuestion"
      />
    </BaseCard>
  </div>
  <BaseCard v-else>
    <EmptyState :icon="Layers" title="No such level" hint="The passport has four levels, 1 to 4." />
  </BaseCard>
</template>
