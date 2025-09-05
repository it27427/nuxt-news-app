<template>
  <div>
    <!-- LOADING -->
    <TopicNewsSkeleton v-if="loading" />

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="healthNews"
      topicName="health"
      topicTitle="স্বাস্থ্য"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import TopicNews from '@/components/sections/TopicNews.vue';
  /** DATA-LOADING-SKELETON  */
  import TopicNewsSkeleton from '@/components/Skeleton/TopicNewsSkeleton.vue';
  import { computed, onMounted, ref } from 'vue';
  import type { TopicItem } from '~~/types/news';

  // LOADING STATE
  const loading = ref(true);

  // DATA
  const healthNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const healthNews = computed(() => healthNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/health.json'
      );
      healthNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load health news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
