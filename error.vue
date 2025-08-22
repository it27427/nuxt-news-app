<template>
  <div class="flex items-center justify-center text-center w-full h-screen bg-red-100">
    <div class="flex flex-col items-center justify-center text-center gap-2" v-if="error">
      <h1>Error {{ props.error.statusCode }}</h1>
      <p>{{ error.message }}</p>
      <NuxtLink to="/" class="bg-red-600">Back to Home</NuxtLink>
    </div>
  </div>
</template>

<script seup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
});
</script>