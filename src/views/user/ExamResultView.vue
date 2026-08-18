<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import { SearchX } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import ExamResult from '@/components/user/ExamResult.vue'
import BenefitList from '@/components/user/BenefitList.vue'
import ServiceList from '@/components/user/ServiceList.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'
import { useExamStore } from '@/stores/exam'

const props = defineProps<{ attemptId: string }>()
const router = useRouter()
const auth = useAuthStore()
const levelStore = useLevelStore()
const examStore = useExamStore()
const attempt = computed(() => examStore.attemptById(Number(props.attemptId)))
const level = computed(() => auth.currentUser?.level ?? 1)
const currentLevel = computed(() => levelStore.levelById(level.value))
const upgradedTo = computed(() => {
  if (!attempt.value?.passed || !currentLevel.value) return null
  return attempt.value.levelId < level.value
    ? { id: currentLevel.value.id, name: currentLevel.value.name }
    : null
})
</script>
<template>
  <div v-if="attempt" class="space-y-5">
    <ExamResult
      :attempt="attempt"
      :pass-criteria="levelStore.passCriteriaFor(attempt.levelId)"
      :upgraded-to="upgradedTo"
    />
    <div v-if="currentLevel" class="grid gap-5 lg:grid-cols-2">
      <BaseCard title="Your benefits now" :subtitle="currentLevel.name">
        <BenefitList :benefits="levelStore.benefitsFor(level)" />
      </BaseCard>
      <BaseCard
        title="Your services now"
        :subtitle="`${levelStore.servicesFor(level).length} unlocked`"
      >
        <ServiceList :services="levelStore.servicesFor(level)" />
      </BaseCard>
    </div>
    <BaseCard>
      <div class="flex flex-wrap gap-3">
        <RouterLink :to="{ name: 'user-dashboard' }">
          <BaseButton as="span">Back to my passport</BaseButton>
        </RouterLink>
        <RouterLink
          v-if="router.hasRoute('user-profile-history')"
          :to="{ name: 'user-profile-history' }"
        >
          <BaseButton as="span" variant="secondary">See my exam history</BaseButton>
        </RouterLink>
        <RouterLink v-if="level < 4" :to="{ name: 'user-elearning' }">
          <BaseButton as="span" variant="ghost">
            {{ upgradedTo ? 'Study the next track' : 'Review this track' }}
          </BaseButton>
        </RouterLink>
      </div>
    </BaseCard>
  </div>
  <BaseCard v-else>
    <EmptyState
      :icon="SearchX"
      title="That attempt is not on record"
      hint="Exam history is kept in memory for the session, so a hard refresh clears attempts made in this sitting."
    />
    <div v-if="router.hasRoute('user-profile-history')" class="text-center">
      <RouterLink :to="{ name: 'user-profile-history' }" class="text-primary text-sm font-semibold">
        Open my exam history
      </RouterLink>
    </div>
  </BaseCard>
</template>
