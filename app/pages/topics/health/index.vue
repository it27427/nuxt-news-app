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
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>(
    '/data/topics/healthNews.json',
    { server: false }
  );

  /** Full news list **/
  const healthNews = computed(() => data.value?.data ?? []);
</script>
