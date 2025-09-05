<template>
  <div class="flex flex-col gap-5">
    <!-- Section Title Skeleton -->
    <div
      class="bg-gray-300 dark:bg-dark-surface rounded w-1/3 animate-pulse h-[3rem] sm:h-[5.625rem] md:h-[3.75rem] lg:h-[4.875rem]"
    ></div>

    <!-- Popular News List Skeleton -->
    <ul
      class="grid gap-4 grid-flow-col grid-rows-5 md:grid-rows-3 md:grid-cols-2"
    >
      <li v-for="n in 5" :key="n">
        <article
          class="flex items-center gap-4 animate-pulse h-[3rem] sm:h-[5.625rem] md:h-[3.75rem] lg:h-[4.875rem]"
        >
          <!-- Counter Placeholder -->
          <div
            class="bg-gray-200 dark:bg-dark-divider w-8 h-full rounded"
          ></div>

          <!-- Title Placeholder -->
          <div
            class="bg-gray-200 dark:bg-dark-divider flex-1 h-full rounded"
          ></div>
        </article>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts"></script>
