<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import type { NavItem } from '@/types'

defineProps<{
  items: NavItem[]
  open: boolean
  collapsed: boolean
}>()
const emit = defineEmits<{ close: []; 'toggle-collapse': [] }>()

const ACTIVE_CLASS = 'bg-primary/10 text-primary-hover'
</script>
<template>
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
    @click="emit('close')"
  />
  <aside
    class="border-border bg-surface fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e transition-[transform,width] duration-200 lg:translate-x-0"
    :class="[open ? 'translate-x-0' : '-translate-x-full', collapsed ? 'lg:w-16' : 'lg:w-64']"
  >
    <div class="flex h-19 shrink-0 items-center gap-2.5 px-5" :class="collapsed ? 'lg:px-3' : ''">
      <div class="flex items-center gap-2.5" :class="collapsed ? 'lg:hidden' : ''">
        <span class="text-foreground leading-tight font-semibold whitespace-nowrap">
          CAT
          <span class="text-muted-foreground block text-xs font-normal">Passport</span>
        </span>
      </div>
      <button
        type="button"
        class="text-muted-foreground hover:bg-border hover:text-foreground ms-auto hidden rounded-lg p-3 transition lg:block"
        :class="collapsed ? 'lg:ms-0' : ''"
        :aria-label="collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'"
        :title="collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'"
        :aria-expanded="!collapsed"
        @click="emit('toggle-collapse')"
      >
        <component
          :is="collapsed ? PanelLeftOpen : PanelLeftClose"
          class="size-4"
          :stroke-width="1.75"
        />
      </button>
    </div>
    <nav class="flex-1 space-y-1 overflow-y-auto p-3">
      <RouterLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        class="text-muted-foreground hover:bg-border hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
        :active-class="item.exact ? '' : ACTIVE_CLASS"
        :exact-active-class="item.exact ? ACTIVE_CLASS : ''"
        :aria-label="item.label"
        :title="collapsed ? item.label : undefined"
        @click="emit('close')"
      >
        <component :is="item.icon" class="size-4 shrink-0" :stroke-width="1.75" />
        <span class="whitespace-nowrap" :class="collapsed ? 'lg:hidden' : ''">
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>
