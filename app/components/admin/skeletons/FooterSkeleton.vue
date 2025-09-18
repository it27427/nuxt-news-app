<template>
  <footer
    class="bg-white dark:bg-slate-800 w-full h-12 flex items-center justify-center gap-2 px-4"
  >
    <!-- Icon Skeleton -->
    <div
      class="w-6 h-6 rounded-full bg-gray-300 dark:bg-slate-700 animate-pulse"
    ></div>

    <!-- Text Skeleton -->
    <div class="flex items-center gap-1">
      <div
        class="w-16 h-4 rounded bg-gray-300 dark:bg-slate-700 animate-pulse"
      ></div>
      <div
        class="w-24 h-4 rounded bg-gray-300 dark:bg-slate-700 animate-pulse"
      ></div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  /* Optional shimmer animation */
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
