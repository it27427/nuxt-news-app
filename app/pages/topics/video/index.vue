<template>
  <TopicNews
    :newsList="videoNews"
    topicName="video"
    topicTitle="ভিডিও"
    class="py-10"
  />
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { VideoItem } from '@/types/news';

  const { data: videoNewsData } = await useFetch<{ data: VideoItem[] }>(
    '/api/videoNews'
  );

  const videoNews: VideoItem[] = videoNewsData.value?.data ?? [];
</script>
