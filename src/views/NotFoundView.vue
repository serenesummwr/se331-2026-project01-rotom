<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaseButton from '@/components/shared/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const attempted = computed(() => route.fullPath)
</script>
<template>
  <div class="stamp-grid grid min-h-dvh place-items-center px-6 py-16 text-center">
    <div class="max-w-md">
      <p class="text-passport-400 text-xs font-semibold tracking-[0.2em] uppercase">
        Hmm....this page doesn't exist.
      </p>
      <h1 class="text-ink-50 mt-4 text-6xl font-bold">404</h1>
      <p class="text-ink-300 mt-4 text-sm leading-relaxed">
        Nothing in the passport lives at
        <code class="bg-ink-800 text-ink-200 rounded px-1.5 py-0.5 text-xs">{{ attempted }}</code
        >. It may have been renamed, or the link may be mistyped.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <RouterLink v-if="auth.isAuthenticated" :to="{ name: auth.homeRoute }">
          <BaseButton as="span">
            {{ auth.isAdmin ? 'Back to the admin overview' : 'Back to my passport' }}
          </BaseButton>
        </RouterLink>
        <RouterLink v-else :to="{ name: 'login' }">
          <BaseButton as="span">Sign in</BaseButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>