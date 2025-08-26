<template>
  <div class="flex items-center justify-center text-center w-full h-screen bg-red-100">
    <div v-if="error" class="flex flex-col items-center justify-center text-center gap-2">
      <h1 class="text-7xl font-semibold">
        Error <span class="text-primary font-sans font-bold">{{ error.statusCode }}</span>
      </h1>
      <p class="text-2xl font-medium mb-4">{{ error.message }}</p>
      <NuxtLink to="/" class="bg-red-600 text-white font-bold rounded-sm px-5 font-sans h-12 flex items-center justify-center :hover:bg-red-800">
        <i class="fa-solid mt-1 mr-1 fa-arrow-left"/> Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

// ✅ Correct defineProps usage (no import needed)
const props = defineProps<{
  error: NuxtError
}>();

const error = props.error;
</script>