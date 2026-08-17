<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import type { Component } from 'vue'

withDefaults(defineProps<{ title: string; hint?: string; icon?: Component }>(), {
  hint: undefined,
  icon: () => Inbox,
})
</script>
<template>
  <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <p class="text-ink-200 text-sm font-semibold">{{ title }}</p>
    <p v-if="hint" class="text-ink-400 max-w-sm text-xs leading-relaxed">{{ hint }}</p>
  </div>
</template>