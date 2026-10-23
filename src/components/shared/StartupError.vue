<script setup lang="ts">
function retry() {
  window.location.reload()
}
</script>

<template>
  <main
    class="bg-background flex min-h-dvh items-center justify-center px-6 py-12"
  >
    <div
      role="alert"
      class="border-border bg-surface w-full max-w-sm rounded-2xl border p-8 text-center"
    >
      <p class="text-primary text-xs font-semibold tracking-wide uppercase">
        CAT Passport
      </p>

      <h1 class="text-foreground mt-4 text-xl font-semibold">
        Unable to connect
      </h1>

      <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
        We couldn’t load your passport. Check your connection and try again.
      </p>

      <button
        type="button"
        class="bg-primary text-primary-foreground hover:bg-primary-hover mt-6 rounded-lg px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        @click="retry"
      >
        Try again
      </button>
    </div>
  </main>
</template>