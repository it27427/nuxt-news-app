<template>
  <div>
    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10">
      Loading Bangladesh news...
    </div>

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
