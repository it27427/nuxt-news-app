<template>
  <TopicNews
    :newsList="healthNews"
    topicName="health"
    topicTitle="স্বাস্থ্য"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: healthNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/healthNews'
  );

  const healthNews: TopicItem[] = healthNewsData.value?.data ?? [];
</script>
