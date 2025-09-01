<template>
  <div>
    <TopicNews
      :newsList="technologyNews"
      topicName="technology"
      topicTitle="প্রযুক্তি"
      class="py-10"
    />

    <!-- Pagination Section -->
    <Pagination
      v-model="currentPage"
      :total-items="technologyNews.length"
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

  const { data: technologyNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/technologyNews'
  );

  const technologyNews = ref<TopicItem[]>(technologyNewsData.value?.data ?? []);

  // Pagination settings
  const itemsPerPage = 24;
  const currentPage = ref(1);

  // Slice news for current page
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return technologyNews.value.slice(start, end);
  });

  // Reset page when news data changes
  watch(technologyNews, () => {
    currentPage.value = 1;
  });
</script>
