<template>
  <TopicNews
    :newsList="economyNews"
    topicName="economy"
    topicTitle="অর্থনীতি"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: economyNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/economyNews'
  );

  const economyNews: TopicItem[] = economyNewsData.value?.data ?? [];
</script>
