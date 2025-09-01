<template>
  <div>
    <TopicNews :newsList="worldNews" topicName="world" topicTitle="বিশ্ব" />

    <!-- Pagination Section -->
    <Pagination
      v-model="currentPage"
      :total-items="worldNews.length"
      :items-per-page="itemsPerPage"
      :max-visible-pages="5"
    />
  </div>
</template>

<script setup lang="ts">
  import Pagination from '@/components/global/Pagination.vue';
  import TopicNews from '@/components/sections/TopicNews.vue';
  import type { TopicItem } from '@/types/news';
  import { computed, ref, watch } from 'vue';

  const { data: worldNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/worldNews'
  );

  const worldNews = ref<TopicItem[]>(worldNewsData.value?.data ?? []);

  // Pagination settings
  const itemsPerPage = 24;
  const currentPage = ref(1);

  // Slice news for current page
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return worldNews.value.slice(start, end);
  });

  // Reset page when news data changes
  watch(worldNews, () => {
    currentPage.value = 1;
  });
</script>
