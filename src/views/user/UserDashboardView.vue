<script setup lang="ts">
import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import BenefitList from '@/components/user/BenefitList.vue'
import ServiceList from '@/components/user/ServiceList.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'

const router = useRouter()
const auth = useAuthStore()
const levelStore = useLevelStore()
const level = computed(() => auth.currentUser?.level ?? 1)
const currentLevel = computed(() => levelStore.levelById(level.value))
const nextLevel = computed(() => levelStore.nextLevel(level.value))
const benefits = computed(() => levelStore.benefitsFor(level.value))
const services = computed(() => levelStore.servicesFor(level.value))
</script>
<template>
  <div v-if="auth.currentUser && currentLevel" class="space-y-5">
    <section
      class="stamp-grid border-ink-700/70 from-ink-800 to-ink-900 rounded-2xl border bg-gradient-to-br p-6 sm:p-8"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-passport-400 text-xs font-semibold tracking-[0.18em] uppercase">
            Your current level
          </p>
          <h2 class="text-ink-50 mt-2 text-3xl font-bold sm:text-4xl">
            {{ currentLevel.name }}
          </h2>
          <p class="text-ink-300 mt-1 text-sm">{{ currentLevel.tagline }}</p>
        </div>
        <LevelBadge :level="level" :name="currentLevel.name" size="lg" />
      </div>
      <p class="text-ink-300 mt-5 max-w-2xl text-sm leading-relaxed">
        {{ currentLevel.description }}
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <RouterLink v-if="router.hasRoute('user-elearning')" :to="{ name: 'user-elearning' }">
          <BaseButton as="span" variant="secondary">Study the eLearning</BaseButton>
        </RouterLink>
         <RouterLink v-if="nextLevel && router.hasRoute('user-exam')" :to="{ name: 'user-exam' }">
          <BaseButton as="span">Take the upgrade exam</BaseButton>
        </RouterLink>
      </div>
    </section>

    <div class="grid gap-5 lg:grid-cols-2">
      <BaseCard title="Your benefits" :subtitle="`Included with ${currentLevel.name}`">
        <BenefitList :benefits="benefits" />
      </BaseCard>
      <BaseCard title="Your services" :subtitle="`${services.length} unlocked at this level`">
        <ServiceList :services="services" />
      </BaseCard>
    </div>

    <BaseCard
      v-if="!nextLevel"
      title="You have reached the top of the passport"
      subtitle="Level 4 is the final level — there is no exam beyond this one"
    >
      <p class="text-ink-300 text-sm leading-relaxed">
        Every benefit and every service the Service offers is already yours.
      </p>
    </BaseCard>
  </div>
</template>