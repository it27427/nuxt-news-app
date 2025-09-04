<template>
  <div>
    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10">Loading economy news...</div>

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="economyNews"
      topicName="economy"
      topicTitle="অর্থনীতি"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { computed, onMounted, ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  // LOADING STATE
  const loading = ref(true);

  // DATA
  const economyNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const economyNews = computed(() => economyNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/economy.json'
      );
      economyNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load economy news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
