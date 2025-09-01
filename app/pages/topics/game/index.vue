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
  import type { TopicItem } from '@/types/news';
  import { computed, ref, watch } from 'vue';

  const { data: gameNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/gameNews'
  );

  const gameNews = ref<TopicItem[]>(gameNewsData.value?.data ?? []);

  // Pagination settings
  const itemsPerPage = 24;
  const currentPage = ref(1);

  // Slice news for current page
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return gameNews.value.slice(start, end);
  });

  // Reset page when news data changes
  watch(gameNews, () => {
    currentPage.value = 1;
  });
</script>
