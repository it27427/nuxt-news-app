<template>
  <div>
    <!-- HOME-HERO-SECTION -->
    <section>
      <div class="jonopath-container">
        <div v-if="mainNewsLoading" class="text-center py-10">
          Loading main news...
        </div>
        <MainNews v-else :mainNews="mainNews" />
      </div>
    </section>

    <!-- AD-SECTION -->
    <AdSection class="py-8 mb-5" />

    <!-- SELECTED-NEWS -->
    <section>
      <div class="jonopath-container">
        <div v-if="selectedNewsLoading" class="text-center py-10">
          Loading selected news...
        </div>
        <SelectedNews v-else :selectedNews="selectedNews" />
      </div>
    </section>

    <!-- TOPIC-NEWS EXAMPLES -->
    <TopicNews
      :newsList="bangladeshNews"
      topicName="bangladesh"
      topicTitle="বাংলাদেশ"
      v-if="!bangladeshNewsLoading"
    />
    <div v-else class="text-center py-10">Loading বাংলাদেশ news...</div>

    <TopicNews
      :newsList="indiaNews"
      topicName="india"
      topicTitle="ভারত"
      v-if="!indiaNewsLoading"
    />
    <div v-else class="text-center py-10">Loading ভারত news...</div>

    <!-- OTHERS-NEWS -->
    <section class="mb-5">
      <div class="jonopath-container">
        <div v-if="othersNewsLoading" class="text-center py-10">
          Loading others news...
        </div>
        <OthersNews v-else :othersNews="othersNews" />
      </div>
    </section>

    <!-- POPULAR-NEWS-SECTION -->
    <section>
      <div class="jonopath-container">
        <div v-if="popularNewsLoading" class="text-center py-10">
          Loading popular news...
        </div>
        <PopularNews v-else :popularNews="popularNews" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import AdSection from '@/components/sections/AdSection.vue';
  import MainNews from '@/components/sections/MainNews.vue';
  import OthersNews from '@/components/sections/OthersNews.vue';
  import PopularNews from '@/components/sections/PopularNews.vue';
  import SelectedNews from '@/components/sections/SelectedNews.vue';
  import TopicNews from '@/components/sections/TopicNews.vue';
  import { onMounted, ref } from 'vue';

  import type {
    NewsItem,
    OthersNewsItem,
    PopularItem,
    TopicItem,
  } from '~~/types/news';

  // DATA REFS
  const mainNews = ref<NewsItem[]>([]);
  const selectedNews = ref<NewsItem[]>([]);
  const othersNews = ref<OthersNewsItem[]>([]);
  const popularNews = ref<PopularItem[]>([]);
  const bangladeshNews = ref<TopicItem[]>([]);
  const indiaNews = ref<TopicItem[]>([]);

  // LOADING STATES
  const mainNewsLoading = ref(true);
  const selectedNewsLoading = ref(true);
  const othersNewsLoading = ref(true);
  const popularNewsLoading = ref(true);
  const bangladeshNewsLoading = ref(true);
  const indiaNewsLoading = ref(true);

  // FETCH DATA
  onMounted(async () => {
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
  });
</script>
