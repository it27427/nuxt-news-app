<template>
  <!-- LOADING -->
  <MostReadNewsSkeleton v-if="loading" />

  <!-- CONTENT -->
  <section
    v-else
    class="flex flex-col gap-4 sm:gap-6 md:gap-8 pt-6 pb-20 md:pb-40"
  >
    <header class="w-full max-w-hmw mx-auto px-2 ss:px-4">
      <h2
        class="font-normal text-size2Xl md:text-size2XXl text-heading dark:text-light-50"
      >
        {{ title }}
      </h2>
    </header>

    <div class="jonopath-container">
      <MostRead :mostReadNews="mostReadNews" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { MostReadItem } from '~~/types/news';

  definePageMeta({ auth: false });

  const loading = ref(true);
  const title = ref('পাঠকপ্রিয় খবর');
  const mostReadNews = ref<MostReadItem[]>([]);

  onMounted(async () => {
    try {
      const data = await $fetch<{ data: MostReadItem[] }>(
        '/data/topics/mostRead.json'
      );
      mostReadNews.value = data?.data ?? [];
    } catch (e) {
      console.error('Failed to load most read news', e);
    } finally {
      loading.value = false;
    }
  });
</script>
