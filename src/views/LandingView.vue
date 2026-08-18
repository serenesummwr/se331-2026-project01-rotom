<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/shared/BaseButton.vue'
</script>
<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <header
      class="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-6 py-5 sm:py-6"
    >
      <span class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl"
        >CAT Passport</span
      >
      <span class="flex items-center gap-3">
        <RouterLink :to="{ name: 'register' }">
          <BaseButton as="span" variant="ghost" size="md">Register</BaseButton>
        </RouterLink>
        <RouterLink :to="{ name: 'login' }">
          <BaseButton as="span" variant="secondary" size="md">Sign in</BaseButton>
        </RouterLink>
      </span>
    </header>
    <main class="stamp-grid flex min-h-0 flex-1 items-center overflow-hidden">
      <div class="mx-auto w-full max-w-6xl -translate-y-6 px-6 py-2 sm:py-3 lg:py-4">
        <div class="max-w-3xl">
          <p class="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Learn · Pass · Level up
          </p>
          <h1
            class="text-foreground mt-3 text-3xl leading-tight font-bold sm:text-4xl lg:mt-4 lg:text-5xl"
          >
            Ready to move up?
          </h1>
          <p
            class="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed sm:text-lg lg:mt-6"
          >
            Work through the lessons for your level, then take the exam when you feel ready. Pass
            it, and your next level—along with new benefits and services—unlocks right away.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
