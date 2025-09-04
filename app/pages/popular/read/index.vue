<template>
  <section class="flex flex-col gap-6 md:gap-8 pt-6 pb-40">
    <header class="w-full max-w-hmw mx-auto">
      <h2 class="text-size2Xl md:text-size2XXl text-heading dark:text-light-50">
        {{ title }}
      </h2>
    </header>

    <div class="jonopath-container">
      <!-- LOADING -->
      <div v-if="loading" class="text-center py-10">
        Loading most read news...
      </div>

      <!-- CONTENT -->
      <MostRead v-else :mostReadNews="mostReadNews" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import MostRead from '@/components/sections/MostRead.vue';
  import { onMounted, ref } from 'vue';
  import type { MostReadItem } from '~~/types/news';

  // TITLE
  const title = ref('পাঠকপ্রিয় খবর');

  // DATA
  const mostReadNews = ref<MostReadItem[]>([]);

  // LOADING STATE
  const loading = ref(true);

  onMounted(async () => {
    try {
      const res = await useFetch<{ data: MostReadItem[] }>(
        '/data/topics/mostRead.json',
        { server: false }
      );

      // ✅ Access data.value safely
      mostReadNews.value = res.data.value?.data ?? [];
    } catch (error) {
      console.error('Failed to load most read news:', error);
    } finally {
      loading.value = false;
    }
  });
</script>
