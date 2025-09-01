<template>
  <div>
    <TopicNews
      :newsList="gameNews"
      topicName="game"
      topicTitle="খেলা"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';
  import { ref } from 'vue';

  /** Fetch data **/
  const { data: gameNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/gameNews'
  );

  /** Full news list **/
  const gameNews = ref<TopicItem[]>(gameNewsData.value?.data ?? []);
</script>
