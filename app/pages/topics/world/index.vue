<template>
  <div>
    <TopicNews :newsList="worldNews" topicName="world" topicTitle="বিশ্ব" />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data: worldNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/worldNews'
  );

  /** Full news list **/
  const worldNews = ref<TopicItem[]>(worldNewsData.value?.data ?? []);
</script>
