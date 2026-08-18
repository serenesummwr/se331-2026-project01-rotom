<script setup lang="ts">
import { ref, watch } from 'vue'
import { CirclePlay } from 'lucide-vue-next'
import EmptyState from '@/components/shared/EmptyState.vue'
import type { ELearningItem } from '@/types'

const props = defineProps<{ lessons: ELearningItem[] }>()
const selectedId = ref<number | null>(props.lessons[0]?.id ?? null)

watch(
  () => props.lessons,
  (lessons) => {
    if (!lessons.some((lesson) => lesson.id === selectedId.value)) {
      selectedId.value = lessons[0]?.id ?? null
    }
  },
)
function lessonById(id: number | null) {
  return props.lessons.find((lesson) => lesson.id === id)
}
</script>
<template>
  <EmptyState
    v-if="lessons.length === 0"
    :icon="CirclePlay"
    title="No lessons for this level yet"
  />
  <div v-else class="grid gap-5 lg:grid-cols-[1fr_20rem]">
    <div v-if="lessonById(selectedId)" class="space-y-4">
      <div class="bg-muted aspect-video overflow-hidden rounded-2xl">
        <iframe
          :key="selectedId ?? 0"
          class="h-full w-full"
          :src="lessonById(selectedId)!.videoUrl"
          :title="lessonById(selectedId)!.title"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div>
        <h3 class="text-foreground text-lg font-semibold">{{ lessonById(selectedId)!.title }}</h3>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          {{ lessonById(selectedId)!.description }}
        </p>
      </div>
    </div>
    <ul class="space-y-2">
      <li v-for="lesson in lessons" :key="lesson.id">
        <button
          type="button"
          class="w-full rounded-xl border p-4 text-start transition"
          :class="
            lesson.id === selectedId
              ? 'border-primary/50 bg-primary/5'
              : 'border-border/70 bg-muted/40 hover:border-border-strong'
          "
          @click="selectedId = lesson.id"
        >
          <span class="flex items-start justify-between gap-3">
            <span class="text-foreground text-sm font-semibold">{{ lesson.title }}</span>
            <span class="text-muted-foreground shrink-0 text-xs">{{ lesson.duration }}</span>
          </span>
          <span class="text-muted-foreground mt-1 block text-xs leading-relaxed">
            {{ lesson.description }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
