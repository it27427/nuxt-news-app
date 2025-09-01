<template>
  <div>
    <TopicNews
      :newsList="technologyNews"
      topicName="technology"
      topicTitle="প্রযুক্তি"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';
  import { ref } from 'vue';

  /** Fetch data **/
  const { data: technologyNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/technologyNews'
  );

  /** Full news list **/
  const technologyNews = ref<TopicItem[]>(technologyNewsData.value?.data ?? []);
</script>
