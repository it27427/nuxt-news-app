<template>
  <section class="flex flex-col gap-6 md:gap-8 pt-6 pb-16">
    <header class="w-full max-w-hmw mx-auto">
      <h2 class="text-size2Xl md:text-size2XXl text-heading dark:text-light-50">
        {{ title }}
      </h2>
    </header>

    <div class="jonopath-container">
      <MostRead :popularNews="popularNews" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import MostRead from '@/components/sections/MostRead.vue';
  import type { PopularItem } from '@/types/news';
  import { ref } from 'vue';

  const title = ref('পাঠকপ্রিয় খবর');

  const { data: popularNewsData } = await useFetch<{ data: PopularItem[] }>(
    '/api/popularNews'
  );

  const popularNews: PopularItem[] = popularNewsData.value?.data ?? [];
</script>
