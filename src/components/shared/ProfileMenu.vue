<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, LogOut } from 'lucide-vue-next'
import LevelBadge from './LevelBadge.vue'
import type { LevelId, ProfileLink, User } from '@/types'

defineProps<{
  user: User
  levelName: string
  links: ProfileLink[]
}>()
const emit = defineEmits<{ logout: [] }>()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
function close() {
  open.value = false
}
function signOut() {
  close()
  emit('logout')
}
function onDocumentClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>
<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="hover:bg-border flex items-center gap-3 rounded-xl px-2 py-1.5 transition"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <img
        :src="user.avatar"
        :alt="`${user.firstName} ${user.lastName}`"
        class="ring-primary/50 bg-border size-9 rounded-lg object-cover ring-2"
      />
      <span class="hidden text-left sm:block">
        <span class="text-foreground block text-sm leading-tight font-semibold">
          {{ user.firstName }} {{ user.lastName }}
        </span>
        <span class="text-muted-foreground block text-xs leading-tight">{{ levelName }}</span>
      </span>
      <ChevronDown
        class="text-muted-foreground size-4 transition-transform"
        :class="open ? 'rotate-180' : ''"
        :stroke-width="1.75"
      />
    </button>
    <div
      v-if="open"
      role="menu"
      class="border-border bg-surface absolute end-0 z-40 mt-2 w-60 overflow-hidden rounded-xl border shadow-xl shadow-black/40"
    >
      <div class="border-border/70 border-b px-4 py-3">
        <p class="text-foreground text-sm font-semibold">
          {{ user.firstName }} {{ user.lastName }}
        </p>
        <p class="text-muted-foreground mb-2 text-xs">{{ user.email }}</p>
        <LevelBadge :level="user.level as LevelId" :name="levelName" size="sm" />
      </div>
      <nav class="py-1">
        <RouterLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="text-muted-foreground hover:bg-border hover:text-foreground block px-4 py-2 text-sm"
          role="menuitem"
          @click="close"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <button
        type="button"
        class="border-border/70 hover:bg-border text-danger flex w-full items-center gap-2.5 border-t px-4 py-2.5 text-start text-sm"
        role="menuitem"
        @click="signOut"
      >
        <LogOut class="size-4" :stroke-width="1.75" />
        Sign out
      </button>
    </div>
  </div>
</template>
