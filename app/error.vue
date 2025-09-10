<template>
  <div
    class="flex items-center justify-center text-center w-full min-h-screen bg-red-100 text-dark p-4"
  >
    <div class="flex flex-col items-center justify-center text-center gap-4">
      <div
        v-if="error.statusCode === 404"
        class="flex flex-col items-center gap-2"
      >
        <h1 class="text-7xl font-bold text-dark">৪০৪</h1>
        <p class="text-2xl font-medium text-dark mb-4">
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই।
        </p>
        <BaseLink
          to="/"
          class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center hover:bg-primary-dark"
        >
          <i class="fa-solid mt-0.5 mr-1 fa-arrow-left" />
          হোম পেজে ফিরে যান
        </BaseLink>
      </div>

      <!-- Other Errors -->
      <div v-else class="flex flex-col items-center gap-2">
        <h1 class="text-7xl font-semibold text-dark">
          ত্রুটি
          <span class="text-red-500 font-sans font-bold">
            {{ error.statusCode }}
          </span>
        </h1>
        <p class="text-2xl font-medium text-dark mb-4">{{ error.message }}</p>
        <BaseLink
          to="/"
          class="bg-primary text-white font-bold rounded-sm px-5 h-12 flex items-center justify-center hover:bg-primary-dark"
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
