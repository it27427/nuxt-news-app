<template>
  <section>
    <div class="jonopath-container">
      <div class="flex flex-col gap-5">
        <!-- For Home Page -->
        <NuxtLink
          v-if="route.path === '/'"
          :to="`/topics/${topicName.toLowerCase()}`"
          class="font-bold text-xl mb-4"
        >
          {{ topicName }}
        </NuxtLink>

        <!-- Topic Pages -->
        <h2 v-else class="font-bold text-xl mb-4">
          {{ topicName }}
        </h2>

        <!-- Topic List -->
        <ul class="topic-list">
          <li class="topic-list-item" v-for="news in newsList" :key="news._id">
            <client-only>
              <NuxtLink :to="`/articles/${news._id}`">
                <BaseFigure class="mb-2 topic-list-thumbnail relative">
                  <BaseImage
                    :src="news.image_url"
                    :alt="news.title"
                    :srcset="news.image_url"
                    class="object-cover aspect-video"
                  />
                  <span
                    v-if="'duration' in news"
                    class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-1 rounded"
                  >
                    {{ news.duration }}
                  </span>
                </BaseFigure>

                <div class="topic-list-details">
                  <h2 :title="news.title">{{ news.title }}</h2>

                  <time :datetime="news.datetime">{{ news.datetime }}</time>
                </div>
              </NuxtLink>
            </client-only>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { TopicItem, VideoItem } from '@/types/news';
  import { useRoute } from 'vue-router';

  const props = defineProps<{
    newsList: (TopicItem | VideoItem)[];
    topicName: string;
  }>();

  const newsList = props.newsList;
  const topicName = props.topicName;

  const route = useRoute();
</script>
