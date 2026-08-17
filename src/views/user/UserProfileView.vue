<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import ProfileHeader from '@/components/shared/ProfileHeader.vue'
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
    <ProfileHeader :user="auth.currentUser" :tabs="tabs" :level-name="levelName" size="lg" />
    <RouterView />
  </div>
</template>
