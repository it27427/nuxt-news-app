<template>
  <div>
    <TopicNews
      :newsList="indiaNews"
      topicName="india"
      topicTitle="ভারত"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>(
    '/data/topics/indiaNews.json',
    { server: false }
  );

  /** Full news list **/
  const indiaNews = computed(() => data.value?.data ?? []);
</script>
