<template>
  <div>
    <TopicNews
      :newsList="gameNews"
      topicName="game"
      topicTitle="খেলা"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { computed } from 'vue';
  import type { TopicItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: TopicItem[] }>('/api/gameNews');

  /** Full news list **/
  const gameNews = computed(() => data.value?.data ?? []);
</script>
