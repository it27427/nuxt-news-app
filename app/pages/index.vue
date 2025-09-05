<template>
  <div>
    <!-- HOME-HERO-SECTION -->
    <section>
      <div class="jonopath-container">
        <MainNewsSkeleton v-if="mainNewsLoading" />
        <MainNews v-else :mainNews="mainNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection class="py-8 mb-5" />

    <!-- SELECTED-NEWS -->
    <section>
      <div class="jonopath-container">
        <SelectedNewsSkeleton v-if="selectedNewsLoading" />
        <SelectedNews v-else :selectedNews="selectedNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection class="py-8 mb-5" />

    <!-- BANGLADESH-NEWS -->
    <TopicNews
      v-if="!bangladeshNewsLoading"
      :newsList="bangladeshNews"
      topicName="bangladesh"
      topicTitle="বাংলাদেশ"
    />
    <div v-else class="text-center py-10">Loading বাংলাদেশ news...</div>

    <!-- INDIA-NEWS -->
    <TopicNews
      v-if="!indiaNewsLoading"
      :newsList="indiaNews"
      topicName="india"
      topicTitle="ভারত"
    />
    <div v-else class="text-center py-10">Loading ভারত news...</div>

    <!-- WORLD-NEWS -->
    <TopicNews
      v-if="!worldNewsLoading"
      :newsList="worldNews"
      topicName="world"
      topicTitle="বিশ্ব"
    />
    <div v-else class="text-center py-10">Loading বিশ্ব news...</div>

    <!-- HEALTH-NEWS -->
    <TopicNews
      v-if="!healthNewsLoading"
      :newsList="healthNews"
      topicName="health"
      topicTitle="স্বাস্থ্য"
    />
    <div v-else class="text-center py-10">Loading স্বাস্থ্য news...</div>

    <!-- VIDEO-NEWS -->
    <TopicNews
      v-if="!videoNewsLoading"
      :newsList="videoNews"
      topicName="video"
      topicTitle="ভিডিও"
    />
    <div v-else class="text-center py-10">Loading ভিডিও news...</div>

    <!-- OTHERS-NEWS -->
    <section class="mb-5">
      <div class="jonopath-container">
        <OthersNewsSkeleton v-if="othersNewsLoading" />
        <OthersNews v-else :othersNews="othersNews" />
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
        <PopularNewsSkeleton v-if="popularNewsLoading" />
        <PopularNews v-else :popularNews="popularNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection class="py-8 mt-5 mb-8" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  import AdSection from '@/components/sections/AdSection.vue';
  import MainNews from '@/components/sections/MainNews.vue';
  import OthersNews from '@/components/sections/OthersNews.vue';
  import PopularNews from '@/components/sections/PopularNews.vue';
  import SelectedNews from '@/components/sections/SelectedNews.vue';
  import SocialSection from '@/components/sections/SocialSection.vue';
  import TopicNews from '@/components/sections/TopicNews.vue';

  /** DATA-LOADING-SKELETON  */
  import OthersNewsSkeleton from '@/components/skeletons/OthersNewsSkeleton.vue';
  import PopularNewsSkeleton from '@/components/skeletons/PopularNewsSkeleton.vue';
  import {
    default as MainNewsSkeleton,
    default as SelectedNewsSkeleton,
  } from '@/components/skeletons/SelectedNewsSkeleton.vue';

  import type {
    NewsItem,
    OthersNewsItem,
    PopularItem,
    TopicItem,
    VideoItem,
  } from '~~/types/news';

  // DATA REFS
  const mainNews = ref<NewsItem[]>([]);
  const selectedNews = ref<NewsItem[]>([]);
  const othersNews = ref<OthersNewsItem[]>([]);
  const popularNews = ref<PopularItem[]>([]);
  const bangladeshNews = ref<TopicItem[]>([]);
  const indiaNews = ref<TopicItem[]>([]);
  const worldNews = ref<TopicItem[]>([]);
  const healthNews = ref<TopicItem[]>([]);
  const videoNews = ref<VideoItem[]>([]);

  // LOADING STATES
  const mainNewsLoading = ref(true);
  const selectedNewsLoading = ref(true);
  const othersNewsLoading = ref(true);
  const popularNewsLoading = ref(true);
  const bangladeshNewsLoading = ref(true);
  const indiaNewsLoading = ref(true);
  const worldNewsLoading = ref(true);
  const healthNewsLoading = ref(true);
  const videoNewsLoading = ref(true);

  // FETCH DATA
  onMounted(async () => {
    try {
      // MAIN NEWS
      mainNews.value =
        (await $fetch<{ data: NewsItem[] }>('/data/home/mainNews.json')).data ??
        [];
      mainNewsLoading.value = false;

      // SELECTED NEWS
      selectedNews.value =
        (await $fetch<{ data: NewsItem[] }>('/data/home/selectedNews.json'))
          .data ?? [];
      selectedNewsLoading.value = false;

      // OTHERS NEWS
      othersNews.value =
        (await $fetch<{ data: OthersNewsItem[] }>('/data/home/othersNews.json'))
          .data ?? [];
      othersNewsLoading.value = false;

      // POPULAR NEWS
      popularNews.value =
        (await $fetch<{ data: PopularItem[] }>('/data/home/popularNews.json'))
          .data ?? [];
      popularNewsLoading.value = false;

      // BANGLADESH NEWS
      bangladeshNews.value = (
        (await $fetch<{ data: TopicItem[] }>('/data/topics/bangladesh.json'))
          .data ?? []
      ).slice(0, 4);
      bangladeshNewsLoading.value = false;

      // INDIA NEWS
      indiaNews.value = (
        (await $fetch<{ data: TopicItem[] }>('/data/topics/india.json')).data ??
        []
      ).slice(0, 4);
      indiaNewsLoading.value = false;

      // WORLD NEWS
      worldNews.value = (
        (await $fetch<{ data: TopicItem[] }>('/data/topics/world.json')).data ??
        []
      ).slice(0, 4);
      worldNewsLoading.value = false;

      // HEALTH NEWS
      healthNews.value = (
        (await $fetch<{ data: TopicItem[] }>('/data/topics/health.json'))
          .data ?? []
      ).slice(0, 4);
      healthNewsLoading.value = false;

      // VIDEO NEWS
      videoNews.value = (
        (await $fetch<{ data: VideoItem[] }>('/data/topics/video.json')).data ??
        []
      ).slice(0, 4);
      videoNewsLoading.value = false;
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  });
</script>
