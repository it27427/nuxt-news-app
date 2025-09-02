<template>
  <div>
    <TopicNews
      :newsList="politicsNews"
      topicName="politics"
      topicTitle="রাজনীতি"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data: politicsNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/politicsNews'
  );

  /** Full news list **/
  const politicsNews = ref<TopicItem[]>(politicsNewsData.value?.data ?? []);
</script>
