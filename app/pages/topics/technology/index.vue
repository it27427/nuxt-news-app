<template>
  <TopicNews
    :newsList="technologyNews"
    topicName="technology"
    topicTitle="প্রযুক্তি"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: technologyNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/technologyNews'
  );

  const technologyNews: TopicItem[] = technologyNewsData.value?.data ?? [];
</script>
