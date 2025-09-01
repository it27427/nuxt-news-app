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
        <h2 v-else class="font-bold text-size2Xl md:text-2xl">
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
              <NuxtLink :to="`/articles/${news._id}`" class="topic-list-link">
                <article class="topic-list-article">
                  <BaseFigure class="mb-2 topic-list-thumbnail relative">
                    <BaseImage
                      :src="news.image_url"
                      :alt="news.title"
                      class="object-cover w-full h-full"
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
                            <path d="M.5.6h12v12H.5z"></path>
                            <path
                              fill="currentColor"
                              d="M2.144.96v11.28l8.712-5.64z"
                            ></path>
                          </g>
                        </svg>
                      </span>

                      {{ news.duration }}
                    </div>
                  </BaseFigure>

                  <div class="topic-list-details">
                    <h2 :title="news.title">{{ news.title }}</h2>

                    <time :datetime="news.datetime">{{ news.datetime }}</time>
                  </div>
                </article>
              </NuxtLink>
            </client-only>
          </li>
        </ul>

        <!-- PAGINATION -->
        <Pagination
          v-model="currentPage"
          :total-items="newsList.length"
          :items-per-page="itemsPerPage"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import Pagination from '@/components/global/Pagination.vue';
  import type { TopicItem, VideoItem } from '@/types/news';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const props = defineProps<{
    newsList: (TopicItem | VideoItem)[];
    topicName: string;
    topicTitle: string;
    sectionClass?: string | string[] | Record<string, boolean>;
  }>();

  const route = useRoute();
  const newsList = props.newsList;
  const topicName = props.topicName;
  const topicTitle = props.topicTitle;
  const sectionClass = props.sectionClass;

  // PAGINATION STATE
  const currentPage = ref(1);
  const itemsPerPage = 24;

  // COMPUTED PAGINATED NEWS
  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return newsList.slice(start, end);
  });

  // RESET PAGE WHEN NEWS CHANGES
  watch(newsList, () => {
    currentPage.value = 1;
  });
</script>
