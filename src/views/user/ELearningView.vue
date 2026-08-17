<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'
import ELearningContent from '@/components/user/ELearningContent.vue'
import { useAuthStore } from '@/stores/auth'
import { useExamStore } from '@/stores/exam'

const auth = useAuthStore()
const examStore = useExamStore()
const level = computed(() => auth.currentUser?.level ?? 1)
const lessons = computed(() => examStore.lessonsFor(level.value))
</script>
<template>
  <div class="space-y-5">
    <BaseCard title="Lessons" flush>
      <div class="p-5">
        <ELearningContent :lessons="lessons" />
      </div>
    </BaseCard>
  </div>
</template>
