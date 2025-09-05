<template>
  <div class="flex flex-col gap-5 my-6 lg:my-10">
    <!-- Title Skeleton -->
    <div
      class="bg-gray-300 dark:bg-dark-divider rounded w-1/3"
      :class="['h-[1.875rem] md:h-[2rem] mb-4']"
    ></div>

    <ul
      class="others-news-list grid ss:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      <li v-for="n in 4" :key="n" class="others-news-list-item animate-pulse">
        <article
          class="others-news-article bg-gray-100 dark:bg-dark-surface rounded-md overflow-hidden flex max-sm:flex-col"
          :class="[
            'max-w-[25rem]:h-[6rem]',
            'max-w-[37.4375rem]:h-[7.75rem]',
            'min-w-[37.5rem]:h-[15.5rem]',
            'min-w-[48rem] max-w-[61.9375rem]:h-[17.5rem]',
            'min-w-[62rem]:h-[16rem]',
          ]"
        >
          <!-- Thumbnail -->
          <div
            class="others-news-thumbnail bg-gray-300 dark:bg-dark-divider w-full aspect-video max-sm:w-1/3 mb-2 max-sm:mb-0"
          ></div>

          <!-- Details -->
          <div class="others-news-details space-y-2 max-sm:pl-2 flex-1">
            <div
              class="h-6 bg-gray-300 dark:bg-dark-divider rounded w-5/6"
            ></div>
            <div
              class="h-3 bg-gray-300 dark:bg-dark-divider rounded w-1/3"
            ></div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .others-news-list {
    @apply grid ss:grid-cols-2 gap-4 mb-10 md:grid-cols-3 lg:grid-cols-4;

    &-item {
      @apply max-sm:row-span-1 max-sm:col-span-2 pt-2;
    }

    .others-news-article {
      @apply max-sm:flex flex-col md:flex-col gap-2 rounded-md overflow-hidden;
    }

    .others-news-thumbnail {
      @apply w-full aspect-video rounded;
    }

    .others-news-details {
      @apply flex flex-col space-y-2;
    }
  }
</style>
