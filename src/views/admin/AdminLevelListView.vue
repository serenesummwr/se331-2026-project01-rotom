<script setup lang="ts">
import { computed } from 'vue'
import LevelCard from '@/components/admin/LevelCard.vue'
import { useLevelStore } from '@/stores/levels'
import { useUserStore } from '@/stores/users'
import { useExamStore } from '@/stores/exam'
import type { LevelId } from '@/types'

const levelStore = useLevelStore()
const userStore = useUserStore()
const examStore = useExamStore()
const rows = computed(() =>
  levelStore.levels.map((level) => ({
    level,
    benefitCount: levelStore.benefitsFor(level.id).length,
    serviceCount: levelStore.servicesFor(level.id).length,
    questionCount: examStore.questionsFor(level.id).length,
    memberCount: userStore.levelCounts[level.id as LevelId] ?? 0,
  })),
)
</script>
<template>
  <div class="space-y-5">
    <p class="text-muted-foreground text-sm">
      The four levels of the passport, what each one unlocks, and the exam that opens the next one.
    </p>
    <div class="grid gap-5 md:grid-cols-2">
      <LevelCard
        v-for="row in rows"
        :key="row.level.id"
        :level="row.level"
        :benefit-count="row.benefitCount"
        :service-count="row.serviceCount"
        :question-count="row.questionCount"
        :member-count="row.memberCount"
      />
    </div>
  </div>
</template>
