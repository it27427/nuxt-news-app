<template>
  <div class="flex flex-col gap-5">
    <h2 class="font-bold text-size2Xl md:text-2xl">{{ title }}</h2>

    <ul class="popular-news-list">
      <li
        class="popular-news-list-item"
        v-for="news in popularNews"
        :key="news._id"
      >
        <NuxtLink :to="`/articles/${news._id}`" class="popular-news-list-link">
          <span class="news-counter">{{ news.counter }}</span>

          <span class="news-title">{{ news.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { PopularItem } from '@/types/news';
  import { ref } from 'vue';

  const title = ref('পাঠকপ্রিয় খবর');

  const { popularNews } = defineProps<{ popularNews: PopularItem[] }>();
</script>
