<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    flush?: boolean
  }>(),
  { title: '', subtitle: '', flush: false },
)
</script>
<template>
  <section
    class="border-border/70 bg-surface/60 overflow-hidden rounded-2xl border shadow-lg shadow-black/20"
  >
    <header
      v-if="title || $slots.actions"
      class="border-border/70 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
    >
      <div>
        <h2 class="text-foreground text-base font-semibold">{{ title }}</h2>
        <p v-if="subtitle" class="text-muted-foreground mt-0.5 text-sm">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div :class="flush ? '' : 'p-5'">
      <slot />
    </div>
  </section>
</template>
