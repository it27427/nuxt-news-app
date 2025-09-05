<template>
  <div class="flex flex-col gap-5 my-6 lg:my-10">
    <!-- Title Skeleton -->
    <div
      class="bg-gray-300 dark:bg-dark-divider rounded w-1/3 md:w-1/5"
      :class="['h-[1.875rem] md:h-[2rem]']"
    ></div>

    <ul
      class="others-news-list grid ss:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      <li v-for="n in 4" :key="n" class="others-news-list-item animate-pulse">
        <article
          class="others-news-article bg-gray-100 dark:bg-dark-surface rounded-md overflow-hidden flex max-md:flex-row md:flex-col"
        >
          <!-- Thumbnail -->
          <div
            class="others-news-thumbnail bg-gray-300 dark:bg-dark-divider w-1/3 md:w-full sm:h-[8.125rem] md:aspect-video mb-2 max-sm:mb-0"
          ></div>

          <!-- Details -->
          <div
            class="others-news-details space-y-2 max-sm:pl-2 md:flex-1 w-2/3 md:w-full"
          >
            <div class="h-5 bg-gray-300 dark:bg-gray-800 rounded w-5/6"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-800 rounded w-full"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-800 rounded w-4/6"></div>
            <div
              class="h-2 bg-gray-300 dark:bg-gray-800 rounded w-1/3 mt-2"
            ></div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .others-news-list {
    @apply grid ss:grid-cols-2 gap-4 mb-10 lg:grid-cols-4;

    &-item {
      @apply max-sm:row-span-1 max-sm:col-span-2 pt-2;
    }

    .others-news-article {
      @apply max-sm:flex max-sm:flex-row md:flex-col gap-2 rounded-md overflow-hidden;
    }

    .others-news-thumbnail {
      @apply max-sm:w-1/3 max-sm:aspect-video max-sm:rounded;
    }

    .others-news-details {
      @apply flex flex-col space-y-2 max-sm:w-2/3 max-sm:pl-2 max-sm:pt-2;
    }
  }
</style>
