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
      :newsList="videoNews"
      topicName="video"
      topicTitle="ভিডিও"
      class="py-10"
    />
  </div>
</template>

<script setup lang="ts">
  import type { VideoItem } from '~~/types/news';

  definePageMeta({ auth: false });

  // LOADING STATE
  const loading = ref(true);

  // DATA
  const videoNewsData = ref<VideoItem[]>([]);

  // COMPUTED
  const videoNews = computed(() => videoNewsData.value ?? []);

  // FETCH DATA ON CLIENT
  onMounted(async () => {
    try {
      const data = await $fetch<{ data: VideoItem[] }>(
        '/data/topics/video.json'
      );
      videoNewsData.value = data?.data ?? [];
    } catch (error) {
      console.error('Failed to load video news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
