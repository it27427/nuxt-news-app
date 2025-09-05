<template>
  <section class="py-10">
    <div class="jonopath-container">
      <div class="flex flex-col gap-5">
        <!-- Title Skeleton -->
        <div
          class="h-8 md:h-10 w-1/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"
        ></div>

        <!-- Skeleton Loader -->
        <ul
          class="grid ss:grid-cols-2 gap-4 mb-10 md:grid-cols-3 lg:grid-cols-4"
        >
          <li v-for="n in 12" :key="n" class="pt-2 animate-pulse">
            <article
              class="max-sm:flex flex-col gap-2 bg-gray-100 dark:bg-dark-surface rounded-md overflow-hidden"
            >
              <!-- Thumbnail Skeleton -->
              <div
                class="max-sm:w-1/3 sm:h-[130px] bg-gray-300 dark:bg-dark-divider rounded mb-2 w-full"
              ></div>

              <!-- Details Skeleton -->
              <div class="max-sm:w-2/3 max-sm:pl-2 flex flex-col space-y-2">
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
    </div>
  </section>
</template>
