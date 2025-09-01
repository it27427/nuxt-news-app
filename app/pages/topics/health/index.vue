<template>
  <div>
    <TopicNews
      :newsList="healthNews"
      topicName="health"
      topicTitle="স্বাস্থ্য"
      class="py-10"
    />

    <!-- Pagination Section -->
    <Pagination
      v-model="currentPage"
      :total-items="healthNews.length"
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

  const { data: healthNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/healthNews'
  );

  const healthNews = ref<TopicItem[]>(healthNewsData.value?.data ?? []);

  // Pagination settings
  const itemsPerPage = 24;
  const currentPage = ref(1);

  // Slice news for current page
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return healthNews.value.slice(start, end);
  });

  // Reset page when news data changes
  watch(healthNews, () => {
    currentPage.value = 1;
  });
</script>
