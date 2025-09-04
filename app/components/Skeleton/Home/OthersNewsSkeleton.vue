<template>
  <div class="flex flex-col gap-5">
    <!-- Section Title Skeleton -->
    <div
      class="bg-gray-300 dark:bg-dark-divider rounded w-1/3 animate-pulse h-[1.875rem] md:h-[2rem]"
    ></div>

    <!-- Others News List Skeleton -->
    <ul class="grid ss:grid-cols-2 gap-4 mb-10 md:grid-cols-3 lg:grid-cols-4">
      <li
        v-for="n in 4"
        :key="n"
        class="max-sm:row-span-1 max-sm:col-span-2 pt-2"
      >
        <article
          class="bg-gray-200 dark:bg-dark-surface rounded-md overflow-hidden animate-pulse flex flex-col gap-2 max-sm:flex md:flex-col"
          :class="[
            'max-xs:h-[6rem]',
            'sm:h-[8rem]',
            'md:h-[16rem]',
            'lg:h-[16.25rem]',
          ]"
        >
          <!-- Thumbnail -->
          <div
            class="bg-gray-300 dark:bg-dark-divider w-full aspect-video rounded max-sm:w-1/3 mb-2 max-sm:mb-0"
          ></div>

          <!-- Details -->
          <div class="flex flex-col space-y-2 max-sm:pl-2 flex-1">
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

<script setup lang="ts"></script>
