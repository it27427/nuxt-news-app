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
  import type { TopicItem } from '@/types/news';
  import { ref } from 'vue';

  /** Fetch data **/
  const { data: healthNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/healthNews'
  );

  /** Full news list **/
  const healthNews = ref<TopicItem[]>(healthNewsData.value?.data ?? []);
</script>
