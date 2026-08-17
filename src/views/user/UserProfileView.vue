<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import TabNav from '@/components/shared/TabNav.vue'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/levels'

const auth = useAuthStore()
const levelStore = useLevelStore()
const tabs = [
  { label: 'My details', to: { name: 'user-profile-details' } },
  { label: 'Exam history', to: { name: 'user-profile-history' } },
  { label: 'Badges', to: { name: 'user-profile-badges' } },
  { label: 'Available services', to: { name: 'user-profile-services' } },
]
const levelName = computed(() =>
  auth.currentUser ? levelStore.levelName(auth.currentUser.level) : '',
)
</script>
<template>
  <div v-if="auth.currentUser" class="space-y-5">
    <BaseCard flush>
      <div class="flex flex-wrap items-center gap-4 px-5 pt-5 pb-4">
        <img
          :src="auth.currentUser.avatar"
          :alt="`${auth.currentUser.firstName} ${auth.currentUser.lastName}`"
          class="ring-passport-400/40 bg-ink-700 size-16 rounded-2xl object-cover ring-2"
        />
        <div class="min-w-0 flex-1">
          <h2 class="text-ink-50 truncate text-xl font-semibold">
            {{ auth.currentUser.firstName }} {{ auth.currentUser.lastName }}
          </h2>
          <p class="text-ink-500 truncate text-sm">
            @{{ auth.currentUser.username }} · {{ auth.currentUser.province }}
          </p>
        </div>
        <LevelBadge :level="auth.currentUser.level" :name="levelName" size="lg" />
      </div>
      <div class="px-5">
        <TabNav :tabs="tabs" />
      </div>
    </BaseCard>
    <RouterView />
  </div>
</template>