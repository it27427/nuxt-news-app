<template>
  <div>
    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10">Loading world news...</div>

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="worldNews"
      topicName="world"
      topicTitle="বিশ্ব"
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
  const worldNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const worldNews = computed(() => worldNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/world.json'
      );
      worldNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load world news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
