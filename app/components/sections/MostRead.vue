<template>
  <ul class="mostread-news-list">
    <li
      class="mostread-news-list-item"
      v-for="news in popularNews"
      :key="news._id"
    >
      <client-only>
        <NuxtLink :to="`/articles/${news._id}`" class="mostread-news-list-link">
          <span class="news-counter">{{ news.counter }}</span>
          <span class="news-title">{{ news.title }}</span>
        </NuxtLink>
      </client-only>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { PopularItem } from '~~/types/news';
  const props = defineProps<{ popularNews: PopularItem[] }>();

  const popularNews = props.popularNews;
</script>
