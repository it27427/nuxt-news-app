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
  import type { VideoItem } from '@/types/news';
  import { ref } from 'vue';

  /** Fetch data **/
  const { data: videoNewsData } = await useFetch<{ data: VideoItem[] }>(
    '/api/videoNews'
  );

  /** Full news list **/
  const videoNews = ref<VideoItem[]>(videoNewsData.value?.data ?? []);
</script>
