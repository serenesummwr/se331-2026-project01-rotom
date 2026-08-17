<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import BaseCard from '@/components/shared/BaseCard.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import BenefitList from '@/components/user/BenefitList.vue'
import ExamHistoryTable from '@/components/user/ExamHistoryTable.vue'
import { useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'
import { useExamStore } from '@/stores/exam'

const route = useRoute()
const userStore = useUserStore()
const levelStore = useLevelStore()
const examStore = useExamStore()
const user = computed(() => userStore.byId(Number(route.params.id)))
const level = computed(() => (user.value ? levelStore.levelById(user.value.level) : undefined))
const attempts = computed(() => (user.value ? examStore.historyFor(user.value.id) : []))
const passed = computed(() => attempts.value.filter((attempt) => attempt.passed).length)
</script>
<template>
  <div v-if="user && level" class="space-y-5">
    <BaseCard :title="level.name" :subtitle="level.tagline">
      <template #actions>
        <RouterLink
          :to="{ name: 'admin-level-detail', params: { id: String(level.id) } }"
          class="text-passport-400 hover:text-passport-300 inline-flex items-center gap-1 text-xs font-semibold"
        >
          Open level
          <ChevronRight class="size-3.5" :stroke-width="2.5" />
        </RouterLink>
      </template>
      <div class="mb-5 flex flex-wrap items-center gap-4">
        <LevelBadge :level="level.id" :name="level.name" size="lg" />
        <p class="text-ink-500 text-xs">
          Pass criteria {{ level.passCriteria }}% ·
          {{ attempts.length }} attempt{{ attempts.length === 1 ? '' : 's' }} on record ·
          {{ passed }} passed
        </p>
      </div>
      <p class="text-ink-300 mb-5 text-sm leading-relaxed">{{ level.description }}</p>
      <p class="text-ink-400 mb-2 text-xs tracking-wide uppercase">Benefits at this level</p>
      <BenefitList :benefits="levelStore.benefitsFor(level.id)" />
    </BaseCard>
    <BaseCard title="Exam history" subtitle="Score, result and the time of every attempt">
      <ExamHistoryTable :attempts="attempts" />
    </BaseCard>
  </div>
</template>