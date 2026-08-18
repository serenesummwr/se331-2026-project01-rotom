<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import { ArrowLeft, Layers } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import QuestionList from '@/components/admin/QuestionList.vue'
import BenefitList from '@/components/user/BenefitList.vue'
import ServiceList from '@/components/user/ServiceList.vue'
import { useLevelStore } from '@/stores/levels'
import { useUserStore } from '@/stores/users'
import { useExamStore } from '@/stores/exam'
import type { LevelId } from '@/types'

const props = defineProps<{ id: string }>()
const levelStore = useLevelStore()
const userStore = useUserStore()
const examStore = useExamStore()
const levelId = computed(() => Number(props.id) as LevelId)
const level = computed(() => levelStore.levelById(levelId.value))
const questions = computed(() => examStore.questionsFor(levelId.value))
const memberCount = computed(() => userStore.levelCounts[levelId.value] ?? 0)
const isFinal = computed(() => levelId.value === 4)
</script>
<template>
  <div v-if="level" class="space-y-5">
    <RouterLink
      :to="{ name: 'admin-levels' }"
      class="text-ink-400 hover:text-ink-100 inline-flex items-center gap-1.5 text-sm"
    >
      <ArrowLeft class="size-4" :stroke-width="1.75" />
      Back to the levels
    </RouterLink>
    <BaseCard>
      <template #actions>
        <RouterLink :to="{ name: 'admin-level-edit', params: { id: String(level.id) } }">
          <BaseButton as="span" size="sm" variant="secondary">Edit level</BaseButton>
        </RouterLink>
      </template>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <LevelBadge :level="level.id" :name="level.name" size="lg" />
          <h2 class="text-ink-50 mt-3 text-2xl font-semibold">{{ level.name }}</h2>
          <p class="text-ink-400 mt-1 text-sm">{{ level.tagline }}</p>
        </div>
        <dl class="grid grid-cols-2 gap-x-8 gap-y-3 text-right">
          <div>
            <dt class="text-ink-500 text-[11px] tracking-wide uppercase">Members</dt>
            <dd class="text-ink-100 text-lg font-semibold">{{ memberCount }}</dd>
          </div>
          <div>
            <dt class="text-ink-500 text-[11px] tracking-wide uppercase">Pass criteria</dt>
            <dd class="text-ink-100 text-lg font-semibold">{{ level.passCriteria }}%</dd>
          </div>
        </dl>
      </div>
      <p class="text-ink-300 mt-5 text-sm leading-relaxed">{{ level.description }}</p>
    </BaseCard>
    <div class="grid gap-5 lg:grid-cols-2">
      <BaseCard title="Benefits" subtitle="Shown on the member's profile at this level">
        <BenefitList :benefits="levelStore.benefitsFor(level.id)" />
      </BaseCard>
      <BaseCard title="Services" subtitle="Unlocked when a member reaches this level">
        <ServiceList :services="levelStore.servicesFor(level.id)" />
      </BaseCard>
    </div>
    <BaseCard
      :title="isFinal ? 'Question bank' : `Upgrade exam — Level ${level.id}`"
      :subtitle="
        isFinal
          ? 'Level 4 is the final level, so these questions are not sat as an upgrade exam'
          : `${questions.length} questions · a member must score ${level.passCriteria}% to reach the next level`
      "
    >
      <QuestionList :questions="questions" />
    </BaseCard>
  </div>
  <BaseCard v-else>
    <EmptyState :icon="Layers" title="No such level" hint="The passport has four levels, 1 to 4." />
  </BaseCard>
</template>
