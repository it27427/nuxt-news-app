<template>
  <div class="my-6 lg:my-10">
    <ul class="main-news-list">
      <li v-for="n in 9" :key="n" class="main-news-list-item animate-pulse">
        <article
          class="main-news-article bg-gray-100 dark:bg-dark-surface rounded-md overflow-hidden"
        >
          <!-- Thumbnail Skeleton -->
          <div
            class="main-news-thumbnail bg-gray-300 dark:bg-dark-divider w-full mb-2 max-xs:w-1/3"
          ></div>

          <!-- Details Skeleton -->
          <div class="main-news-details space-y-2 max-xs:w-2/3 max-xs:pl-2">
            <div
              class="h-5 bg-gray-300 dark:bg-dark-divider rounded w-5/6"
            ></div>
            <div
              class="h-4 bg-gray-300 dark:bg-dark-divider rounded w-full"
            ></div>
            <div
              class="h-3 bg-gray-300 dark:bg-dark-divider rounded w-4/6"
            ></div>
            <div
              class="h-2 bg-gray-300 dark:bg-dark-divider rounded w-1/3 mt-2"
            ></div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .main-news-list {
    @apply grid grid-cols-2 gap-4 mb-10 md:grid-cols-3 lg:grid-cols-4;

    &-item {
      @apply pt-2;

      .main-news-article {
        @apply flex ss:flex-col gap-2;

        .main-news-thumbnail {
          @apply ss:w-full ss:aspect-video ss:rounded;
        }

        .main-news-details {
          @apply flex flex-col space-y-2;
        }
      }

      &:first-child {
        @apply row-span-3 col-span-2 md:row-span-2 border-0;

        .main-news-article {
          @apply flex flex-col gap-2;

          .main-news-thumbnail {
            @apply w-full aspect-video rounded;
          }

          .main-news-details {
            @apply w-full;
          }
        }
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6),
      &:nth-child(7) {
        @apply row-span-1 col-span-2 ss:row-span-2 ss:col-span-1 border-t border-light-50 dark:border-dark-divider ss:border-0;
      }

      &:nth-child(2),
      &:nth-child(3) {
        @apply md:row-span-1 md:col-span-1;
      }

      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6),
      &:nth-child(7) {
        @apply md:row-span-1 md:col-span-1;
      }

      &:nth-child(7) {
        @apply md:border-t md:border-light-50 md:dark:border-dark-divider;
      }

      &:nth-child(6) {
        @apply md:border-t md:border-light-50 md:dark:border-dark-divider md:row-span-1 md:col-span-1;

        .main-news-article {
          .main-news-thumbnail {
            @apply lg:hidden;
          }

          .main-news-details {
            @apply lg:w-full lg:pl-0;
          }
        }
      }

      &:nth-child(8),
      &:nth-child(9) {
        @apply max-sm:row-span-1 max-sm:col-span-2 max-sm:border-t max-sm:border-light-50 max-sm:dark:border-dark-divider;

        .main-news-article {
          @apply max-sm:flex max-sm:flex-row;

          .main-news-thumbnail {
            @apply max-sm:w-1/3 max-sm:aspect-video max-sm:rounded;
          }

          .main-news-details {
            @apply max-sm:w-2/3 max-sm:pl-2 max-sm:pt-2;
          }
        }
      }

      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9) {
        @apply md:row-span-1 md:col-span-1 md:border-t md:border-light-50 dark:border-dark-divider;

        .main-news-article {
          @apply md:flex;

          .main-news-thumbnail {
            @apply md:hidden;
          }

          .main-news-details {
            @apply md:w-full md:pl-0;
          }
        }
      }
    }
  }
</style>
