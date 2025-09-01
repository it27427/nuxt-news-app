<template>
  <TopicNews
    :newsList="indiaNews"
    topicName="india"
    topicTitle="ভারত"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: indiaNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/indiaNews'
  );

  const indiaNews: TopicItem[] = indiaNewsData.value?.data ?? [];
</script>
