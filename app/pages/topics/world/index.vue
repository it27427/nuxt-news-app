<template>
  <div>
    <TopicNews :newsList="worldNews" topicName="world" topicTitle="বিশ্ব" />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';
  import { ref } from 'vue';

  /** Fetch data **/
  const { data: worldNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/worldNews'
  );

  /** Full news list **/
  const worldNews = ref<TopicItem[]>(worldNewsData.value?.data ?? []);
</script>
