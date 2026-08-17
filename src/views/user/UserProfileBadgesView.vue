<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'
import BadgeList from '@/components/user/BadgeList.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'

const auth = useAuthStore()
const levelStore = useLevelStore()
const level = computed(() => auth.currentUser?.level ?? 1)
const earned = computed(() => levelStore.badgesUpTo(level.value).length)
</script>
<template>
  <BaseCard
    title="Badges"
    :subtitle="`${earned} of ${levelStore.levelBadges.length} stamps collected`"
    flush
  >
    <div class="stamp-grid px-5 py-8">
      <BadgeList :badges="levelStore.levelBadges" :current-level="level" />
    </div>
  </BaseCard>
</template>