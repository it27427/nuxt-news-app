<template>
  <div class="my-6 lg:my-10">
    <ul class="main-news-list">
      <li class="main-news-list-item" v-for="news in mainNews" :key="news._id">
        <NuxtLink :to="`/articles/${news._id}`" class="main-news-link">
          <article class="main-news-article">
            <BaseFigure class="mb-2 main-news-thumbnail">
              <BaseImage
                :src="news.image_url"
                :alt="news.title"
                :srcset="news.image_url"
                class="object-cover aspect-video"
              />
            </BaseFigure>

            <div class="main-news-details">
              <h2 :title="news.title">{{ news.title }}</h2>
              <p>{{ news.description }}</p>

              <time :datetime="news.datetime">{{ news.datetime }}</time>
            </div>
          </article>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { NewsItem } from '@/types/news';

  const { mainNews } = defineProps<{ mainNews: NewsItem[] }>();
</script>
