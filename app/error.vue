<template>
  <div
    class="flex items-center justify-center w-full min-h-screen bg-red-200 dark:bg-slate-950 p-4"
  >
    <div class="flex flex-col items-center justify-center text-center">
      <div
        v-if="error.statusCode === 404"
        class="flex flex-col items-center gap-4"
      >
        <div class="flex flex-col items-center gap-2">
          <h1 class="text-7xl font-bold text-red-500">ত্রুটি ৪০৪</h1>
          <p class="text-2xl font-medium text-red-500 mb-4">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি।
          </p>
        </div>

        <BaseLink
          to="/"
          class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center transition-all hover:bg-primary-dark"
        >
          <i class="fa-solid mr-1 fa-arrow-left" />
          হোম পেজে ফিরে যান
        </BaseLink>
      </div>

      <!-- অন্যান্য ত্রুটি -->
      <div v-else class="flex flex-col items-center gap-4">
        <div class="flex flex-col items-center gap-2">
          <h1 class="text-7xl font-bold text-red-500 font-bengali">
            ত্রুটি
            <span class="text-7xl font-bold text-red-500 font-bengali">
              {{ error.statusCode }}
            </span>
          </h1>
          <p class="text-2xl font-medium text-red-500 mb-4">
            {{ error.message }}
          </p>
        </div>

        <BaseLink
          to="/"
          class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center transition-all hover:bg-primary-dark"
        >
          <i class="fa-solid mt-0.5 mr-1 fa-arrow-left" />
          হোম পেজে ফিরে যান
        </BaseLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { NuxtError } from '#app';
  import BaseLink from '@/components/base/BaseLink.vue';

  // Props
  const props = defineProps<{ error: NuxtError }>();
  const error = props.error;
</script>
