<template>
  <div class="flex flex-col gap-5">
    <!-- Title Skeleton -->
    <div
      class="h-8 md:h-10 w-1/3 md:w-1/5 bg-gray-300 dark:bg-dark-divider rounded animate-pulse"
    ></div>

    <ul class="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
      <li v-for="n in 6" :key="n" class="animate-pulse">
        <div
          class="flex items-center gap-4 p-2 rounded-md bg-gray-100 dark:bg-dark-surface"
        >
          <!-- Icon skeleton -->
          <div
            class="w-12 h-12 md:w-16 md:h-16 bg-gray-300 dark:bg-dark-divider rounded-full flex-shrink-0"
          ></div>

          <!-- Label skeleton -->
          <div class="flex flex-col justify-center flex-1">
            <div
              class="h-5 bg-gray-300 dark:bg-dark-divider rounded w-3/4 mb-2"
            ></div>
            <div
              class="h-3 bg-gray-300 dark:bg-dark-divider rounded w-1/2"
            ></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  /* Smooth shimmer animation instead of only pulse */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .animate-pulse > div > div {
    background: linear-gradient(
      90deg,
      rgba(229, 231, 235, 0.2) 25%,
      rgba(229, 231, 235, 0.6) 50%,
      rgba(229, 231, 235, 0.2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .dark .animate-pulse > div > div {
    background: linear-gradient(
      90deg,
      rgba(55, 65, 81, 0.2) 25%,
      rgba(75, 85, 99, 0.6) 50%,
      rgba(55, 65, 81, 0.2) 75%
    );
  }
</style>
