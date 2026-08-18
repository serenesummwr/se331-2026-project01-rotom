<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'
import ExamHistoryTable from '@/components/user/ExamHistoryTable.vue'
import { useAuthStore } from '@/stores/auth'
import { useExamStore } from '@/stores/exam'

const auth = useAuthStore()
const examStore = useExamStore()
const attempts = computed(() => (auth.currentUser ? examStore.historyFor(auth.currentUser.id) : []))
const passed = computed(() => attempts.value.filter((attempt) => attempt.passed).length)
</script>
<template>
  <BaseCard
    title="Exam history"
    :subtitle="`${attempts.length} attempt${attempts.length === 1 ? '' : 's'} · ${passed} passed`"
  >
    <ExamHistoryTable :attempts="attempts" />
  </BaseCard>
</template>
