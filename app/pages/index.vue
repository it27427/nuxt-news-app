<template>
  <div>
    <!-- HOME-HERO-SECTION -->
    <section>
      <div class="jonopath-container">
        <MainNews :mainNews="mainNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection class="py-8 mb-5" />

    <!-- SELECTED-NEWS -->
    <section>
      <div class="jonopath-container">
        <SelectedNews :selectedNews="selectedNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection class="py-8 mb-5" />

    <!-- BANGLADESH-NEWS -->
    <TopicNews
      :newsList="bangladeshNews"
      topicName="bangladesh"
      topicTitle="বাংলাদেশ"
    />

    <!-- INDIA-NEWS -->
    <TopicNews :newsList="indiaNews" topicName="india" topicTitle="ভারত" />

    <!-- WORLD-NEWS -->
    <TopicNews :newsList="worldNews" topicName="world" topicTitle="বিশ্ব" />

    <!-- HEALTH-NEWS -->
    <TopicNews
      :newsList="healthNews"
      topicName="health"
      topicTitle="স্বাস্থ্য"
    />

    <!-- HEALTH-NEWS -->
    <TopicNews :newsList="videoNews" topicName="video" topicTitle="ভিডিও" />

    <!-- OTHERS-NEWS -->
    <section class="mb-5">
      <div class="jonopath-container">
        <OthersNews :othersNews="othersNews" />
      </div>
    </section>

    <!-- SOCIAL-SECTION -->
    <section class="mb-12">
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
    <AdSection class="py-8 my-5" />
  </div>
</template>

<script setup lang="ts">
  import AdSection from '@/components/sections/AdSection.vue';
  import MainNews from '@/components/sections/MainNews.vue';
  import OthersNews from '@/components/sections/OthersNews.vue';
  import PopularNews from '@/components/sections/PopularNews.vue';
  import SelectedNews from '@/components/sections/SelectedNews.vue';
  import SocialSection from '@/components/sections/SocialSection.vue';
  import TopicNews from '@/components/sections/TopicNews.vue';

  import type {
    NewsItem,
    OthersNewsItem,
    PopularItem,
    TopicItem,
    VideoItem,
  } from '@/types/news';

  const { data: mainNewsData } = await useFetch<{ data: NewsItem[] }>(
    '/api/mainNews'
  );
  const { data: selectedNewsData } = await useFetch<{ data: NewsItem[] }>(
    '/api/selectedNews'
  );
  const { data: othersNewsData } = await useFetch<{ data: OthersNewsItem[] }>(
    '/api/othersNews'
  );
  const { data: popularNewsData } = await useFetch<{ data: PopularItem[] }>(
    '/api/popularNews'
  );
  const { data: bangladeshNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/bangladeshNews'
  );
  const { data: indiaNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/indiaNews'
  );
  const { data: worldNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/worldNews'
  );
  const { data: healthNewsData } = await useFetch<{ data: TopicItem[] }>(
    '/api/healthNews'
  );
  const { data: videoNewsData } = await useFetch<{ data: VideoItem[] }>(
    '/api/videoNews'
  );

  const mainNews: NewsItem[] = mainNewsData.value?.data ?? [];
  const selectedNews: NewsItem[] = selectedNewsData.value?.data ?? [];
  const othersNews: OthersNewsItem[] = othersNewsData.value?.data ?? [];
  const popularNews: PopularItem[] = popularNewsData.value?.data ?? [];

  // Only first 4 items
  const bangladeshNews: TopicItem[] = (
    bangladeshNewsData.value?.data ?? []
  ).slice(0, 4);
  const indiaNews: TopicItem[] = (indiaNewsData.value?.data ?? []).slice(0, 4);
  const worldNews: TopicItem[] = (worldNewsData.value?.data ?? []).slice(0, 4);
  const healthNews: TopicItem[] = (healthNewsData.value?.data ?? []).slice(
    0,
    4
  );
  const videoNews: VideoItem[] = (videoNewsData.value?.data ?? []).slice(0, 4);
</script>
