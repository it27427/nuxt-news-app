<template>
  <div>
    <!-- Topic News Section -->
    <TopicNews
      :newsList="bangladeshNews"
      topicName="bangladesh"
      topicTitle="বাংলাদেশ"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';
  import { ref } from 'vue';

  // Fetch data
  const { data: bangladeshNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/bangladeshNews'
  );

  // Full news list
  const bangladeshNews = ref<TopicItem[]>(bangladeshNewsData.value?.data ?? []);
</script>
