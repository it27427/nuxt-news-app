<template>
  <ul class="mostread-news-list">
    <li
      class="mostread-news-list-item"
      v-for="news in mostReadNews"
      :key="news._id"
    >
      <client-only>
        <NuxtLink :to="`/articles/${news._id}`" class="mostread-news-list-link">
          <h3 class="news-counter">{{ news.counter }}</h3>
          <article class="most-read-news-article">
            <BasePicture>
              <BaseImage
                :src="news.image_url"
                :alt="news.title"
                class="object-cover w-full h-full"
              />
            </BasePicture>
            <h3 class="news-title">{{ news.title }}</h3>
          </article>
        </NuxtLink>
      </client-only>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import BaseImage from '@/components/base/BaseImage.vue';
  import BasePicture from '@/components/base/BasePicture.vue';
  import type { MostReadItem } from '~~/types/news';
  const props = defineProps<{ mostReadNews: MostReadItem[] }>();

  const mostReadNews = props.mostReadNews;
</script>
