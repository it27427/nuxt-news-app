<template>
  <div class="flex flex-col gap-5">
    <h2 class="font-bold text-size2Xl md:text-2xl">{{ title }}</h2>

    <ul class="selected-news-list">
      <li
        class="selected-news-list-item"
        v-for="news in selectedNews"
        :key="news._id"
      >
        <client-only>
          <BaseLink :to="`/articles/${news._id}`" class="selected-news-link">
            <article class="selected-news-article">
              <BasePicture class="selected-news-thumbnail">
                <BaseImage
                  :src="news.image_url"
                  :alt="news.title"
                  class="object-cover w-full mb-2"
                />
              </BasePicture>

              <div class="selected-news-details">
                <h2 :title="news.title">{{ news.title }}</h2>
                <p>{{ news.description }}</p>

                <time :datetime="news.datetime">{{ news.datetime }}</time>
              </div>
            </article>
          </BaseLink>
        </client-only>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import BaseImage from '~/components/base/BaseImage.vue';
  import BaseLink from '~/components/base/BaseLink.vue';
  import BasePicture from '~/components/base/BasePicture.vue';

  const title = ref('নির্বাচিত খবর');

  import type { NewsItem } from '~~/types/news';

  const { selectedNews } = defineProps<{ selectedNews: NewsItem[] }>();
</script>
