<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import ProfileHeader from '@/components/shared/ProfileHeader.vue'
import { ArrowLeft, UserSearch } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import { useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'

const props = defineProps<{ id: string }>()
const userStore = useUserStore()
const levelStore = useLevelStore()
const user = computed(() => userStore.byId(Number(props.id)))
const tabs = computed(() => [
  { label: 'Information', to: { name: 'admin-user-info' }, params: { id: props.id } },
  { label: 'Edit', to: { name: 'admin-user-edit' }, params: { id: props.id } },
])
</script>
<template>
  <div v-if="user" class="space-y-5">
    <RouterLink
      :to="{ name: 'admin-users' }"
      class="text-ink-400 hover:text-ink-100 inline-flex items-center gap-1.5 text-sm"
    >
      <ArrowLeft class="size-4" :stroke-width="1.75" />
      Back to the directory
    </RouterLink>
    <ProfileHeader
      :user="user"
      :tabs="tabs"
      :level-name="levelStore.levelName(user.level)"
      show-status
    />
    <RouterView />
  </div>
  <BaseCard v-else>
    <EmptyState
      :icon="UserSearch"
      title="No member with that id"
      :hint="`The directory has no member number ${id}. Head back and pick one from the list.`"
    />
    <div class="text-center">
      <RouterLink :to="{ name: 'admin-users' }" class="text-passport-400 text-sm font-semibold">
        Back to the directory
      </RouterLink>
    </div>
  </BaseCard>
</template>
