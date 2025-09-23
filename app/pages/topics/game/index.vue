<template>
  <div>
    <!-- LOADING -->
    <TopicNewsSkeleton
      v-if="loading"
      :item-count="12"
      :show-pagination="true"
    />

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
  import TopicNews from '~/components/sections/TopicNews.vue';
  /** DATA-LOADING-SKELETON  */
  import { computed, onMounted, ref } from 'vue';
  import TopicNewsSkeleton from '~/components/skeletons/TopicNewsSkeleton.vue';
  import type { TopicItem } from '~~/types/news';

  definePageMeta({ auth: false });

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
