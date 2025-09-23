<template>
  <section :class="sectionClass">
    <div class="jonopath-container">
      <div class="flex flex-col gap-5">
        <!-- For Home Page -->
        <NuxtLink
          v-if="route.path === '/'"
          :to="`/topics/${topicName.toLowerCase()}`"
          class="text-dark-surface dark:text-white topic-link"
        >
          <h2
            class="font-bold text-size2Xl md:text-2xl flex items-center gap-1 transition-all"
          >
            {{ topicTitle }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              class="transition-all"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </h2>
        </NuxtLink>

        <!-- Topic Pages -->
        <h2 v-else class="font-bold text-size2Xl md:text-2xl lg:text-size4Xl">
          {{ topicTitle }}
        </h2>

        <!-- Topic List -->
        <ul class="topic-list">
          <li
            class="topic-list-item"
            v-for="news in paginatedNews"
            :key="news._id"
          >
            <client-only>
              <BaseLink :to="`/articles/${news._id}`" class="topic-list-link">
                <article class="topic-list-article">
                  <BasePicture class="topic-list-thumbnail relative">
                    <BaseImage
                      :src="news.image_url"
                      :alt="news.title"
                      class="object-cover mb-2 w-full md:h-40 lg:h-[8.125rem]"
                    />
                    <div v-if="'duration' in news" class="duration">
                      <span class="icon">
                        <svg
                          viewBox="0 0 12 12"
                          width="12"
                          height="12"
                          xmlns="http://www.w3.org/2000/svg"
                          focusable="false"
                          aria-hidden="true"
                        >
                          <g fill="none" fill-rule="evenodd">
                            <path d="M.5.6h12v12H.5z" />
                            <path
                              fill="currentColor"
                              d="M2.144.96v11.28l8.712-5.64z"
                            />
                          </g>
                        </svg>
                      </span>
                      {{ news.duration }}
                    </div>
                  </BasePicture>
                  <div class="topic-list-details">
                    <h2 :title="news.title">{{ news.title }}</h2>
                    <time :datetime="news.datetime">{{ news.datetime }}</time>
                  </div>
                </article>
              </BaseLink>
            </client-only>
          </li>
        </ul>
      </div>

      <!-- PAGINATION -->
      <Pagination
        v-model="currentPage"
        :total-items="newsList.length"
        :items-per-page="itemsPerPage"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import BaseImage from '~/components/base/BaseImage.vue';
  import BaseLink from '~/components/base/BaseLink.vue';
  import BasePicture from '~/components/base/BasePicture.vue';
  import Pagination from '~/components/global/Pagination.vue';
  import type { TopicItem, VideoItem } from '~~/types/news';

  const props = defineProps<{
    newsList: (TopicItem | VideoItem)[];
    topicName: string;
    topicTitle: string;
    sectionClass?: string | string[] | Record<string, boolean>;
  }>();

  const route = useRoute();
  const topicName = props.topicName;
  const topicTitle = props.topicTitle;
  const sectionClass = props.sectionClass;

  // PAGINATION
  const currentPage = ref(1);
  const itemsPerPage = 24;
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return newsList.value?.slice(start, end) ?? [];
  });

  // WATCH NEWS LIST
  const newsList = ref<(TopicItem | VideoItem)[]>([]);
  watch(
    () => props.newsList,
    (newVal) => {
      newsList.value = newVal;
      currentPage.value = 1;
    },
    { immediate: true }
  );
</script>
