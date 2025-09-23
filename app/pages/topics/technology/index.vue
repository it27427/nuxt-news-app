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
      :newsList="technologyNews"
      topicName="technology"
      topicTitle="প্রযুক্তি"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import type { TopicItem } from '~~/types/news';

  definePageMeta({ auth: false });

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
