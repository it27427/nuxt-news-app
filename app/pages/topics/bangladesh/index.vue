<template>
  <TopicNews
    :newsList="bangladeshNews"
    topicName="bangladesh"
    topicTitle="বাংলাদেশ"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: bangladeshNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/bangladeshNews'
  );

  const bangladeshNews: TopicItem[] = bangladeshNewsData.value?.data ?? [];
</script>
