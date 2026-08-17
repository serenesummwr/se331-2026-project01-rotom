<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import LevelBadge from '@/components/shared/LevelBadge.vue'
import TabNav from '@/components/shared/TabNav.vue'
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
    <BaseCard flush>
      <div class="flex flex-wrap items-center gap-4 px-5 pt-5 pb-4">
        <img
          :src="user.avatar"
          :alt="`${user.firstName} ${user.lastName}`"
          class="ring-passport-400/40 bg-ink-700 size-14 rounded-2xl object-cover ring-2"
        />
        <div class="min-w-0 flex-1">
          <h2 class="text-ink-50 truncate text-lg font-semibold">
            {{ user.firstName }} {{ user.lastName }}
          </h2>
          <p class="text-ink-500 truncate text-sm">@{{ user.username }} · {{ user.province }}</p>
        </div>
        <div class="flex items-center gap-2">
          <LevelBadge :level="user.level" :name="levelStore.levelName(user.level)" />
          <span
            class="rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="user.active ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
          >
            {{ user.active ? 'Active' : 'Deactivated' }}
          </span>
        </div>
      </div>
      <div class="px-5">
        <TabNav :tabs="tabs" />
      </div>
    </BaseCard>
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
