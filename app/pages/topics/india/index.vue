<template>
  <div>
    <TopicNews
      :newsList="indiaNews"
      topicName="india"
      topicTitle="ভারত"
      class="py-10"
    />

    <!-- Pagination Section -->
    <Pagination
      v-model="currentPage"
      :total-items="indiaNews.length"
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

  const { data: indiaNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/indiaNews'
  );

  const indiaNews = ref<TopicItem[]>(indiaNewsData.value?.data ?? []);

  // Pagination settings
  const itemsPerPage = 24;
  const currentPage = ref(1);

  // Slice news for current page
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return indiaNews.value.slice(start, end);
  });

  // Reset page when news data changes
  watch(indiaNews, () => {
    currentPage.value = 1;
  });
</script>
