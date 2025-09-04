<template>
  <div class="flex flex-col gap-5 my-6 lg:my-10">
    <!-- Title Skeleton -->
    <div
      class="h-8 md:h-10 w-1/3 bg-gray-300 dark:bg-dark-divider rounded animate-pulse mb-4"
    ></div>

    <ul class="selected-news-list">
      <li v-for="n in 5" :key="n" class="selected-news-list-item animate-pulse">
        <article
          class="selected-news-article bg-gray-100 dark:bg-dark-surface rounded-md overflow-hidden"
        >
          <!-- Thumbnail -->
          <div
            class="selected-news-thumbnail bg-gray-300 dark:bg-dark-divider w-full aspect-video mb-2"
          ></div>

          <!-- Details -->
          <div class="selected-news-details space-y-2">
            <div
              class="h-6 bg-gray-300 dark:bg-dark-divider rounded w-5/6"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-dark-divider rounded w-full"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-dark-divider rounded w-4/6"
            ></div>
            <div
              class="h-3 bg-gray-300 dark:bg-dark-divider rounded w-1/3 mt-2"
            ></div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .selected-news-list {
    @apply grid grid-cols-2 gap-4 mb-5 md:mb-10 md:grid-cols-3 lg:grid-cols-4;

    &-item {
      @apply pt-2;

      &:first-child {
        @apply row-span-3 col-span-2 md:row-span-2 border-0;
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5) {
        @apply row-span-1 col-span-2 ss:row-span-2 ss:col-span-1 border-t border-light-50 dark:border-dark-divider ss:border-0;
      }

      &:nth-child(2),
      &:nth-child(3) {
        @apply md:row-span-1 md:col-span-1;
      }

      &:nth-child(4),
      &:nth-child(5) {
        @apply md:row-span-1 md:col-span-1;
      }
    }

    .selected-news-article {
      @apply flex flex-col md:flex-col gap-2;
    }

    .selected-news-thumbnail {
      @apply w-full aspect-video rounded;
    }

    .selected-news-details {
      @apply flex flex-col space-y-2;
    }
  }
</style>
