<template>
  <div>
    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10">Loading game news...</div>

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="gameNews"
      topicName="game"
      topicTitle="খেলা"
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
  const gameNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const gameNews = computed(() => gameNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/game.json'
      );
      gameNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load game news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
