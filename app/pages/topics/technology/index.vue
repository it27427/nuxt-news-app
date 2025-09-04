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
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>(
    '/data/topics/technologyNews.json',
    { server: false }
  );

  /** Full news list **/
  const technologyNews = computed(() => data.value?.data ?? []);
</script>
