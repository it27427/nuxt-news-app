<template>
  <TopicNews
    :newsList="politicsNews"
    topicName="politics"
    topicTitle="রাজনীতি"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: politicsNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/politicsNews'
  );

  const politicsNews: TopicItem[] = politicsNewsData.value?.data ?? [];
</script>
