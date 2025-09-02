<template>
  <div>
    <TopicNews
      :newsList="videoNews"
      topicName="video"
      topicTitle="ভিডিও"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { computed } from 'vue';
  import type { VideoItem } from '~~/types/news';

  /** Fetch data **/
  const { data } = await useFetch<{ data: VideoItem[] }>('/api/videoNews');

  /** Full news list **/
  const videoNews = computed(() => data.value?.data ?? []);
</script>
