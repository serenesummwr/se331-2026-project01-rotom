<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import UserFilters from '@/components/admin/UserFilters.vue'
import UserTable from '@/components/admin/UserTable.vue'
import PaginationControls from '@/components/admin/PaginationControls.vue'
import { PAGE_SIZE, useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'
import type { UserFilterState } from '@/types'

const userStore = useUserStore()
const levelStore = useLevelStore()
const route = useRoute()
const router = useRouter()
const levelNames = computed(() =>
  Object.fromEntries(levelStore.levels.map((level) => [level.id, level.name])),
)

watch(
  () => route.query.page,
  (value) => userStore.setPage(Number(value ?? 1)),
  { immediate: true },
)

watch(
  () => userStore.page,
  (page) => {
    const current = Number(route.query.page ?? 1)
    if (current === page) return
    router.replace({
      query: { ...route.query, page: page === 1 ? undefined : String(page) },
    })
  },
)
function onFilterUpdate(patch: Partial<UserFilterState>) {
  userStore.setFilters(patch)
}
function goToPage(page: number) {
  router.push({ query: { ...route.query, page: page === 1 ? undefined : String(page) } })
}
</script>
<template>
  <div class="space-y-5">
    <BaseCard title="Filters" subtitle="Name and surname, level, or province">
      <UserFilters
        :filters="userStore.filters"
        :provinces="userStore.provinceOptions"
        :levels="levelStore.levels"
        :result-count="userStore.filteredUsers.length"
        @update="onFilterUpdate"
        @reset="userStore.resetFilters()"
      />
    </BaseCard>
    <BaseCard flush title="Members" :subtitle="`Page ${userStore.page} of ${userStore.totalPages}`">
      <UserTable :users="userStore.pagedUsers" :level-names="levelNames" />
      <PaginationControls
        :page="userStore.page"
        :total-pages="userStore.totalPages"
        :total-items="userStore.filteredUsers.length"
        :page-size="PAGE_SIZE"
        @change="goToPage"
      />
    </BaseCard>
  </div>
</template>
