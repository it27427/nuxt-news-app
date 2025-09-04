<template>
  <div>
    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10">
      Loading technology news...
    </div>

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="technologyNews"
      topicName="technology"
      topicTitle="প্রযুক্তি"
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
  const technologyNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const technologyNews = computed(() => technologyNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/technology.json'
      );
      technologyNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load technology news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
