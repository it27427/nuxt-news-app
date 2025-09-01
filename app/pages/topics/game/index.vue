<template>
  <TopicNews
    :newsList="gameNews"
    topicName="game"
    topicTitle="খেলা"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';

  const { data: gameNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/gameNews'
  );

  const gameNews: TopicItem[] = gameNewsData.value?.data ?? [];
</script>
