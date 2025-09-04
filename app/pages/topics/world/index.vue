<template>
  <div>
    <TopicNews :newsList="worldNews" topicName="world" topicTitle="বিশ্ব" />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>(
    '/data/topics/worldNews.json',
    { server: false }
  );

  /** Full news list **/
  const worldNews = computed(() => data.value?.data ?? []);
</script>
