<template>
  <div>
    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10">Loading politics news...</div>

    <!-- CONTENT -->
    <TopicNews
      v-else
      :newsList="politicsNews"
      topicName="politics"
      topicTitle="রাজনীতি"
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
  const politicsNewsData = ref<TopicItem[]>([]);

  // COMPUTED
  const politicsNews = computed(() => politicsNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: TopicItem[] }>(
        '/data/topics/politics.json'
      );
      politicsNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load politics news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
