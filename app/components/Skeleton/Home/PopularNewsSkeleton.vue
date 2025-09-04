<template>
  <div class="flex flex-col gap-5 animate-pulse my-6 lg:my-10">
    <!-- Title Skeleton -->
    <div
      class="bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 h-[1.875rem] md:h-[2rem] mb-4"
    ></div>

    <!-- List Skeleton -->
    <ul
      class="grid gap-4 grid-flow-col grid-rows-5 md:grid-rows-3 md:grid-cols-2"
    >
      <li
        v-for="n in 5"
        :key="n"
        class="bg-gray-200 dark:bg-gray-700 rounded-md w-full h-[3rem] md:h-[3.75rem] lg:h-[5rem]"
      ></li>
    </ul>
  </div>
</template>

<script setup lang="ts"></script>
