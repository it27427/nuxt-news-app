<template>
  <div class="jonopath-container">
    <section>
      <MainNews :mainNews="mainNews" />
    </section>
  </div>
</template>

<script setup lang="ts">
  import MainNews from '@/components/sections/MainNews.vue';
  import type { NewsItem } from '@/types/news';

  const { data: mainNewsData } = await useFetch<{ data: NewsItem[] }>(
    '/api/mainNews'
  );

  const mainNews: NewsItem[] = mainNewsData.value?.data ?? [];
</script>
