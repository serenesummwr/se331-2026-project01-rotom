<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'
import ServiceList from '@/components/user/ServiceList.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'

const auth = useAuthStore()
const levelStore = useLevelStore()
const level = computed(() => auth.currentUser?.level ?? 1)
const currentLevel = computed(() => levelStore.levelById(level.value))
const nextLevel = computed(() => levelStore.nextLevel(level.value))
</script>
<template>
  <div class="space-y-5">
    <BaseCard
      v-if="currentLevel"
      title="Available to you now"
      :subtitle="`Unlocked at ${currentLevel.name}`"
    >
      <ServiceList :services="levelStore.servicesFor(level)" />
    </BaseCard>
    <BaseCard
      v-if="nextLevel"
      :title="`Locked until ${nextLevel.name}`"
      :subtitle="`Pass the Level ${level} exam to unlock these`"
    >
      <ServiceList :services="levelStore.servicesFor(nextLevel.id)" locked />
    </BaseCard>
  </div>
</template>