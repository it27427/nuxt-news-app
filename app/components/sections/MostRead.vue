<template>
  <ul class="mostread-news-list">
    <li
      class="mostread-news-list-item"
      v-for="news in mostReadNews"
      :key="news._id"
    >
      <client-only>
        <BaseLink
          :to="`/articles/${news._id}`"
          class="mostread-news-list-link w-full"
        >
          <!-- Counter -->
          <h3 class="news-counter w-6">{{ news.counter }}</h3>
          <!-- Content -->
          <article
            class="w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] flex items-center bg-light-divider text-dark dark:bg-dark-divider dark:text-white p-2"
          >
            <!-- Image -->
            <BasePicture class="w-[6.8rem] md:w-[7.5rem]">
              <BaseImage
                :src="news.image_url"
                :alt="news.title"
                class="object-cover w-full"
              />
            </BasePicture>

            <!-- Title -->
            <div
              class="w-[calc(100%-6.8rem)] md:w-[calc(100%-7.5rem)] px-2 md:px-4"
            >
              <h3 class="news-title max-md:text-sm" title="news.title">
                <span class="line-clamp-2">
                  {{ news.title }}
                </span>
              </h3>
            </div>
          </article>
        </BaseLink>
      </client-only>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import BaseImage from '~/components/base/BaseImage.vue';
  import BaseLink from '~/components/base/BaseLink.vue';
  import BasePicture from '~/components/base/BasePicture.vue';
  import type { MostReadItem } from '~~/types/news';
  const props = defineProps<{ mostReadNews: MostReadItem[] }>();

  const mostReadNews = props.mostReadNews;
</script>
