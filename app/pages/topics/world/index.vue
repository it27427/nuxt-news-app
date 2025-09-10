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
      :newsList="worldNews"
      topicName="world"
      topicTitle="বিশ্ব"
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

  definePageMeta({ auth: false });

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
