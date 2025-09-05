<template>
  <div class="flex flex-col gap-5 animate-pulse my-6 lg:my-10">
    <!-- Title Skeleton -->
    <div
      class="bg-gray-300 dark:bg-gray-700 rounded-md w-1/3"
      :class="['h-[1.875rem] md:h-[2rem]']"
    ></div>

    <!-- List Skeleton -->
    <ul
      class="popular-news-list grid gap-4 grid-flow-col grid-rows-5 md:grid-rows-3 md:grid-cols-2"
    >
      <li
        v-for="n in 5"
        :key="n"
        class="bg-gray-300 dark:bg-gray-800 rounded-md w-full"
        :class="['h-[2.25rem] md:h-[2.75rem] lg:h-[3rem]']"
      ></li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .popular-news-list {
    @apply grid gap-4 grid-flow-col grid-rows-5 md:grid-rows-3 md:grid-cols-2;

    li {
      @apply rounded-md w-full;
    }
  }
</style>
