<template>
  <Header
    class="sticky top-0 left-0 w-full bg-green-900 flex flex-col px-6 z-50"
  >
    <nav class="flex items-center justify-between w-full h-20">
      <!-- Logo Skeleton -->
      <div
        class="w-24 h-16 rounded bg-gray-300 dark:bg-slate-700 animate-pulse"
      ></div>

      <!-- Right Controls Skeleton -->
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-700 animate-pulse"
        ></div>
        <div
          class="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-700 animate-pulse"
        ></div>
      </div>
    </nav>
  </Header>
</template>

<script setup lang="ts">
  import Header from '~/components/global/layouts/Header.vue';
</script>

<style scoped lang="scss">
  /* Optional: gradient shimmer for modern effect */
  .animate-pulse {
    @apply relative overflow-hidden;
  }

  .animate-pulse::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700;
    animation: pulseShimmer 1.5s infinite;
  }

  @keyframes pulseShimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
