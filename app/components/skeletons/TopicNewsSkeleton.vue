<template>
  <section class="py-10">
    <div class="jonopath-container">
      <div class="flex flex-col gap-5">
        <!-- Title Skeleton -->
        <div
          class="h-8 md:h-10 w-1/3 md:w-1/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
        ></div>

        <!-- Skeleton Loader -->
        <ul class="topic-list">
          <li
            v-for="n in itemCount"
            :key="n"
            class="topic-list-item animate-pulse"
          >
            <article
              class="topic-list-article flex-col gap-2 bg-gray-100 dark:bg-dark-surface rounded-md overflow-hidden"
            >
              <!-- Thumbnail Skeleton -->
              <div
                class="topic-list-thumbnail bg-gray-300 dark:bg-dark-divider rounded mb-2 w-full sm:h-[130px]"
              ></div>

              <!-- Details Skeleton -->
              <div class="topic-list-details flex flex-col space-y-2 w-full">
                <div
                  class="h-6 bg-gray-300 dark:bg-gray-800 rounded w-5/6"
                ></div>
                <div
                  class="h-4 bg-gray-300 dark:bg-gray-800 rounded w-full"
                ></div>
                <div
                  class="h-4 bg-gray-300 dark:bg-gray-800 rounded w-4/6"
                ></div>
                <div
                  class="h-3 bg-gray-300 dark:bg-gray-800 rounded w-1/3 mt-2"
                ></div>
              </div>
            </article>
          </li>
        </ul>
      </div>

      <!-- Pagination Skeleton -->
      <nav
        v-if="showPagination"
        class="w-full flex items-center justify-center mt-6"
      >
        <ul class="pagination flex items-center">
          <!-- Previous -->
          <li>
            <div
              class="page-link w-9 h-9 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          </li>

          <!-- Page Numbers -->
          <li v-for="n in 5" :key="n">
            <div
              class="page-link w-9 h-9 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          </li>

          <!-- Next -->
          <li>
            <div
              class="page-link w-9 h-9 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
  interface SkeletonProps {
    itemCount?: number;
    showPagination?: boolean;
  }

  const props = defineProps<SkeletonProps>();

  // Default values
  const itemCount = props.itemCount ?? 12;
  const showPagination = props.showPagination ?? true;
</script>

<style scoped lang="scss">
  .topic-list {
    @apply grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4;
  }
  .topic-list-item {
    @apply rounded-md w-full;
  }
</style>
