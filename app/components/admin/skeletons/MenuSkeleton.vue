<template>
  <ul class="flex flex-col gap-2">
    <li
      v-for="i in 12"
      :key="i"
      class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 animate-pulse"
    >
      <!-- Icon Placeholder -->
      <div class="w-8 h-8 rounded bg-gray-300 dark:bg-slate-700 mx-auto"></div>
      <!-- Label Placeholder (always visible) -->
      <div class="h-4 bg-gray-300 dark:bg-slate-700 rounded flex-1"></div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
  /* Gradient shimmer animation */
  .animate-pulse {
    @apply relative overflow-hidden;
  }

  .animate-pulse::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
         dark:from-slate-700 dark:via-slate-600 dark:to-slate-700;
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
