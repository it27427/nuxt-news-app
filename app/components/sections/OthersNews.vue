<template>
  <div class="flex flex-col gap-5">
    <h2 class="font-bold text-size2Xl md:text-2xl">{{ title }}</h2>

    <ul class="others-news-list">
      <li
        class="others-news-list-item"
        v-for="news in othersNews"
        :key="news._id"
      >
        <client-only>
          <NuxtLink :to="`/articles/${news._id}`" class="others-news-link">
            <article class="others-news-article">
              <BasePicture class="mb-2 others-news-thumbnail">
                <BaseImage
                  :src="news.image_url"
                  :alt="news.title"
                  class="object-cover aspect-video"
                />
              </BasePicture>

              <div class="others-news-details">
                <h2 :title="news.title">{{ news.title }}</h2>

                <time :datetime="news.datetime">{{ news.datetime }}</time>
              </div>
            </article>
          </NuxtLink>
        </client-only>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import BaseImage from '@/components/base/BaseImage.vue';
  import BasePicture from '@/components/base/BasePicture.vue';
  import { ref } from 'vue';
  import type { OthersNewsItem } from '~~/types/news';

  const title = ref('অন্যান্য খবর');

  const { othersNews } = defineProps<{ othersNews: OthersNewsItem[] }>();
</script>
