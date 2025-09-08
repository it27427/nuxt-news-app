<template>
  <div
    class="flex items-center justify-center text-center w-full h-screen bg-red-100 text-dark"
  >
    <div
      v-if="error"
      class="flex flex-col items-center justify-center text-center gap-2"
    >
      <h1 class="text-7xl font-semibold text-dark">
        Error
        <span class="text-red-500 font-sans font-bold">
          {{ error.statusCode }}
        </span>
      </h1>
      <p class="text-2xl font-medium text-dark mb-4">{{ error.message }}</p>
      <BaseLink
        to="/"
        class="bg-primary text-white font-bold rounded-sm px-5 font-sans h-12 flex items-center justify-center hover:bg-primary-dark"
      >
        <i class="fa-solid mt-0.5 mr-1 fa-arrow-left" />
        Back to Home
      </BaseLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { NuxtError } from '#app';
  import BaseLink from '@/components/base/BaseLink.vue';

  // ✅ Correct defineProps usage (no import needed)
  const props = defineProps<{
    error: NuxtError;
  }>();

  const error = props.error;
</script>
