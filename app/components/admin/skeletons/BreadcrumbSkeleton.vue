<template>
  <div class="flex items-center gap-2 px-6 py-4 animate-pulse">
    <!-- Left Slot Placeholder -->
    <div class="w-32 h-6 bg-gray-300 dark:bg-slate-700 rounded"></div>

    <nav class="flex items-center gap-2 flex-1">
      <!-- Home icon placeholder -->
      <div class="w-6 h-6 bg-gray-300 dark:bg-slate-700 rounded-full"></div>

      <!-- Separator placeholder -->
      <div class="w-4 h-4 bg-gray-300 dark:bg-slate-700 rounded-full"></div>

      <!-- Current page label placeholder -->
      <div class="flex-1 h-6 bg-gray-300 dark:bg-slate-700 rounded ml-1"></div>

      <!-- Button placeholder -->
      <div class="w-8 h-8 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
  /* Optional shimmer effect */
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
