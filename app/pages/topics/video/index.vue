<template>
  <div>
    <TopicNews
      :newsList="videoNews"
      topicName="video"
      topicTitle="ভিডিও"
      class="py-10"
    />

    <!-- Pagination Section -->
    <Pagination
      v-model="currentPage"
      :total-items="videoNews.length"
      :items-per-page="itemsPerPage"
      :max-visible-pages="5"
    />
  </div>
</template>

<script setup lang="ts">
  import Pagination from '@/components/global/Pagination.vue';
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { VideoItem } from '@/types/news';
  import { computed, ref, watch } from 'vue';

  const { data: videoNewsData } = await useFetch<{ data: VideoItem[] }>(
    '/api/videoNews'
  );

  const videoNews = ref<TopicItem[]>(videoNewsData.value?.data ?? []);

  // Pagination settings
  const itemsPerPage = 24;
  const currentPage = ref(1);

  // Slice news for current page
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return videoNews.value.slice(start, end);
  });

  // Reset page when news data changes
  watch(videoNews, () => {
    currentPage.value = 1;
  });
</script>
