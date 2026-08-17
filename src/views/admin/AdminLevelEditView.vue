<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import { ArrowLeft, Layers } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import LevelEditForm from '@/components/admin/LevelEditForm.vue'
import { useLevelStore } from '@/stores/levels'
import type { LevelEditable, LevelId } from '@/types'

const props = defineProps<{ id: string }>()
const levelStore = useLevelStore()
const router = useRouter()
const levelId = computed(() => Number(props.id) as LevelId)
const level = computed(() => levelStore.levelById(levelId.value))
const saved = ref(false)
function save(values: LevelEditable) {
  levelStore.updateLevel(levelId.value, values)
  saved.value = true
}
function cancel() {
  router.push({ name: 'admin-level-detail', params: { id: props.id } })
}
</script>
<template>
  <div v-if="level" class="space-y-5">
    <RouterLink
      :to="{ name: 'admin-level-detail', params: { id } }"
      class="text-ink-400 hover:text-ink-100 inline-flex items-center gap-1.5 text-sm"
    >
      <ArrowLeft class="size-4" :stroke-width="1.75" />
      Back to {{ level.name }}
    </RouterLink>
    <BaseCard
      :title="`Edit Level ${level.id}`"
      subtitle="Name, tagline, description and the pass criteria for the upgrade exam"
    >
      <p
        v-if="saved"
        class="bg-success/10 text-success mb-5 rounded-lg px-3.5 py-2.5 text-xs font-medium"
      >
        Saved. The landing page, the member dashboards and the exam pass mark all read this level
        from the same store, so they are already showing the new values.
      </p>
      <LevelEditForm :level="level" @save="save" @cancel="cancel" />
    </BaseCard>
  </div>
  <BaseCard v-else>
    <EmptyState :icon="Layers" title="No such level" hint="The passport has four levels, 1 to 4." />
  </BaseCard>
</template>