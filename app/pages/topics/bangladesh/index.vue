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
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>('/api/bangladeshNews');

  /** Full news list **/
  const bangladeshNews = computed(() => data.value?.data ?? []);
</script>
