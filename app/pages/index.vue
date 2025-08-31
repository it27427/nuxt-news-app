<template>
  <!-- HOME-HERO-SECTION -->
  <section>
    <div class="jonopath-container">
      <MainNews :mainNews="mainNews" />
    </div>
  </section>

  <!-- AD-SECTION -->
  <AdSection />

  <!-- SELECTED-NEWS -->
  <section class="mb-10">
    <div class="jonopath-container">
      <SelectedNews />
    </div>
  </section>

  <!-- AD-SECTION -->
  <AdSection />
</template>

<script setup lang="ts">
  import AdSection from '@/components/sections/AdSection.vue';
  import MainNews from '@/components/sections/MainNews.vue';
  import SelectedNews from '@/components/sections/SelectedNews.vue';
  import type { NewsItem } from '@/types/news';

  const { data: mainNewsData } = await useFetch<{ data: NewsItem[] }>(
    '/api/mainNews'
  );

  const mainNews: NewsItem[] = mainNewsData.value?.data ?? [];
</script>
