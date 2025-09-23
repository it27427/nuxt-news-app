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
      :newsList="politicsNews"
      topicName="politics"
      topicTitle="রাজনীতি"
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
