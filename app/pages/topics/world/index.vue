<template>
  <TopicNews :newsList="worldNews" topicName="world" topicTitle="বিশ্ব" />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: worldNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/worldNews'
  );

  const worldNews: TopicItem[] = worldNewsData.value?.data ?? [];
</script>
