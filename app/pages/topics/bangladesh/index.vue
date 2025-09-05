<template>
  <div>
    <!-- LOADING -->
    <TopicNewsSkeleton v-if="loading" />

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="bangladeshNews"
      topicName="bangladesh"
      topicTitle="বাংলাদেশ"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  /** DATA-LOADING-SKELETON  */
  import TopicNewsSkeleton from '@/components/skeletons/TopicNewsSkeleton.vue';
  import { computed, onMounted, ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  // LOADING STATE
  const loading = ref(true);

  // DATA
  const bangladeshNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const bangladeshNews = computed(() => bangladeshNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/bangladesh.json'
      );
      bangladeshNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load Bangladesh news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
