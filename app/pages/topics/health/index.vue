<template>
  <div>
    <TopicNews
      :newsList="healthNews"
      topicName="health"
      topicTitle="স্বাস্থ্য"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data: healthNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/healthNews'
  );

  /** Full news list **/
  const healthNews = ref<TopicItem[]>(healthNewsData.value?.data ?? []);
</script>
