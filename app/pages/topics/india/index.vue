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
  import type { TopicItem } from '@/types/news';
  import { ref } from 'vue';

  /** Fetch data **/
  const { data: indiaNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/indiaNews'
  );

  /** Full news list **/
  const indiaNews = ref<TopicItem[]>(indiaNewsData.value?.data ?? []);
</script>
