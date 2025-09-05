<template>
  <section class="flex flex-col gap-6 md:gap-8 pt-6 pb-40">
    <!-- Title Skeleton -->
    <header class="w-full max-w-hmw mx-auto px-2 ss:px-4">
      <div
        class="h-[1.875rem] md:h-[2rem] w-1/3 md:w-1/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
      ></div>
    </header>

    <div class="jonopath-container">
      <ul class="grid gap-2 grid-flow-col grid-rows-5">
        <li
          v-for="n in 5"
          :key="n"
          class="flex items-center gap-4 animate-pulse"
        >
          <!-- Counter Skeleton -->
          <div
            class="news-counter w-8 h-12 bg-gray-300 dark:bg-gray-700 rounded"
          ></div>

          <article
            class="flex items-center gap-4 w-[calc(100%-2rem)] h-[5.215rem] bg-gray-100 dark:bg-gray-800 p-2 rounded"
          >
            <!-- Thumbnail Skeleton -->
            <div
              class="w-[6.8rem] md:w-[7.5rem] h-16 md:h-[4.215rem] bg-gray-300 dark:bg-gray-700 rounded"
            ></div>

            <!-- Title Skeleton -->
            <div
              class="w-[calc(100%-6.8rem)] md:w-[calc(100%-7.5rem)] h-16 md:h-[4.215rem] flex flex-col justify-center gap-2 px-2 md:px-4"
            >
              <div
                class="h-3 md:h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"
              ></div>
              <div
                class="h-3 md:h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"
              ></div>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>
