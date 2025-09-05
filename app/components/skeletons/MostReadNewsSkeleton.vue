<template>
  <section class="flex flex-col gap-6 animate-pulse md:gap-8 pt-6 pb-40">
    <!-- Title Skeleton -->
    <header class="w-full max-w-hmw mx-auto">
      <div
        class="h-8 md:h-10 w-full bg-gray-300 dark:bg-dark-divider rounded mb-4"
      ></div>
    </header>

    <div class="jonopath-container">
      <ul class="mostread-news-list">
        <li
          v-for="n in 5"
          :key="n"
          class="mostread-news-list-item animate-pulse"
        >
          <div class="mostread-news-list-link">
            <!-- Counter Skeleton -->
            <div
              class="news-counter w-6 h-10 bg-gray-300 dark:bg-gray-700 rounded"
            ></div>

            <article
              class="w-[calc(100%-1.5rem)] bg-gray-100 dark:bg-dark-surface flex items-center p-2 rounded"
            >
              <!-- Thumbnail Skeleton -->
              <div
                class="w-[6.8rem] md:w-[7.5rem] h-[4.5rem] md:h-[5rem] bg-gray-300 dark:bg-dark-divider rounded"
              ></div>

              <!-- Title Skeleton -->
              <div
                class="w-[calc(100%-6.8rem)] md:w-[calc(100%-7.5rem)] px-2 md:px-4 flex flex-col justify-center"
              >
                <div
                  class="h-4 md:h-5 bg-gray-300 dark:bg-gray-800 rounded w-5/6 mb-2"
                ></div>
                <div
                  class="h-4 md:h-5 bg-gray-300 dark:bg-gray-800 rounded w-4/6"
                ></div>
              </div>
            </article>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
