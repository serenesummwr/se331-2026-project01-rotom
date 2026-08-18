<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
}>()
const emit = defineEmits<{ change: [page: number] }>()
const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= props.totalPages)
const from = computed(() => (props.totalItems === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.page * props.pageSize, props.totalItems))

const pages = computed(() => {
  const window = 2
  const start = Math.max(1, props.page - window)
  const end = Math.min(props.totalPages, props.page + window)
  const list: number[] = []
  for (let page = start; page <= end; page += 1) list.push(page)
  return list
})
const buttonClass =
  'inline-flex items-center gap-1 rounded-lg border border-ink-700 px-3 py-1.5 text-xs font-semibold text-ink-200 transition hover:border-passport-400/60 hover:text-passport-300'
</script>
<template>
  <nav
    v-if="totalPages > 1"
    class="border-ink-700/70 flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4"
    aria-label="Directory pages"
  >
    <p class="text-ink-500 text-xs">
      Showing <span class="text-ink-300 font-semibold">{{ from }}–{{ to }}</span> of
      <span class="text-ink-300 font-semibold">{{ totalItems }}</span>
    </p>
    <div class="flex items-center gap-1.5">
      <button v-if="!isFirst" type="button" :class="buttonClass" @click="emit('change', page - 1)">
        <ChevronLeft class="size-3.5" :stroke-width="2.5" />
        Previous
      </button>
      <button
        v-for="number in pages"
        :key="number"
        type="button"
        class="min-w-9 rounded-lg px-3 py-1.5 text-xs font-semibold transition"
        :class="
          number === page
            ? 'bg-passport-400 text-accent-fg'
            : 'text-ink-300 hover:bg-ink-700/60 hover:text-ink-50'
        "
        :aria-current="number === page ? 'page' : undefined"
        @click="emit('change', number)"
      >
        {{ number }}
      </button>
      <button v-if="!isLast" type="button" :class="buttonClass" @click="emit('change', page + 1)">
        Next
        <ChevronRight class="size-3.5" :stroke-width="2.5" />
      </button>
    </div>
  </nav>
</template>
