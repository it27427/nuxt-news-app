<template>
  <section class="p-6 max-w-lg mx-auto animate-pulse">
    <!-- Skeleton Page Title -->
    <div class="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

    <!-- Skeleton Form -->
    <div class="flex flex-col gap-4">
      <!-- Name field -->
      <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
      
      <!-- Email field -->
      <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
      
      <!-- Password field -->
      <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>

      <!-- Role select -->
      <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>

      <!-- Submit Button -->
      <div class="h-12 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
/* Optional: Smooth shimmer animation */
@keyframes shimmer {
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
}

.animate-pulse {
  @apply relative overflow-hidden;
}

.animate-pulse::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.2) 50%,
    rgba(255,255,255,0) 100%
  );
  background-size: 500px 100%;
  animation: shimmer 1.5s infinite;
}
</style>
