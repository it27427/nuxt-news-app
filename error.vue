<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <BaseLink to="/">Back to Home</BaseLink>
  </div>
</template>

<script seup lang="ts">
import type { NuxtError } from '#app';
import BaseLink from '@/components/base/BaseLink.vue';

const props = defineProps({
  error: Object as () => NuxtError
});
</script>