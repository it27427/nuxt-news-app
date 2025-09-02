<template>
  <div>
    <TopicNews
      :newsList="economyNews"
      topicName="economy"
      topicTitle="অর্থনীতি"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data: economyNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/economyNews'
  );

  /** Full news list **/
  const economyNews = ref<TopicItem[]>(economyNewsData.value?.data ?? []);
</script>
