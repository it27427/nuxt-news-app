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
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>(
    '/data/topics/politicsNews.json',
    { server: false }
  );

  /** Full news list **/
  const politicsNews = computed(() => data.value?.data ?? []);
</script>
