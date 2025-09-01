<template>
  <div>
    <!-- HOME-HERO-SECTION -->
    <section>
      <div class="jonopath-container">
        <MainNews :mainNews="mainNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection />

    <!-- SELECTED-NEWS -->
    <section>
      <div class="jonopath-container">
        <SelectedNews :selectedNews="selectedNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection />

    <!-- OTHERS-NEWS -->
    <section class="mb-5">
      <div class="jonopath-container">
        <OthersNews :othersNews="othersNews" />
      </div>
    </section>

    <!-- SOCIAL-SECTION -->
    <section class="mb-10">
      <div class="jonopath-container">
        <SocialSection />
      </div>
    </section>

    <!-- POPULAR-NEWS-SECTION -->
    <section>
      <div class="jonopath-container">
        <PopularNews :popularNews="popularNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection />

    <div class="mb-6"></div>
  </div>
</template>

<script setup lang="ts">
  import AdSection from '@/components/sections/AdSection.vue';
  import MainNews from '@/components/sections/MainNews.vue';
  import OthersNews from '@/components/sections/OthersNews.vue';
  import PopularNews from '@/components/sections/PopularNews.vue';
  import SelectedNews from '@/components/sections/SelectedNews.vue';
  import SocialSection from '@/components/sections/SocialSection.vue';
  import type { NewsItem, OthersNewsItem, PopularItem } from '@/types/news';

  /* FETCH-MAIN-NEWS */
  const { data: mainNewsData } = await useFetch<{ data: NewsItem[] }>(
    '/api/mainNews'
  );

  /* FETCH-SELECTED-NEWS */
  const { data: selectedNewsData } = await useFetch<{ data: NewsItem[] }>(
    '/api/selectedNews'
  );

  /* FETCH-OTHERS-NEWS */
  const { data: othersNewsData } = await useFetch<{ data: OthersNewsItem[] }>(
    '/api/othersNews'
  );

  /* FETCH-POPULAR-NEWS */
  const { data: popularNewsData } = await useFetch<{ data: PopularItem[] }>(
    '/api/popularNews'
  );

  const mainNews: NewsItem[] = mainNewsData.value?.data ?? [];
  const selectedNews: NewsItem[] = selectedNewsData.value?.data ?? [];
  const othersNews: OthersNewsItem[] = othersNewsData.value?.data ?? [];
  const popularNews: PopularItem[] = popularNewsData.value?.data ?? [];
</script>
