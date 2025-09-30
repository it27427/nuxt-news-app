<template>
  <section class="max-w-4xl mx-auto p-6">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
      <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
      <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-64"></div>
    </div>

    <!-- News Content -->
    <div
      v-else-if="news"
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ news.title }}
      </h2>

      <!-- Metadata -->
      <div
        class="flex flex-col md:flex-row gap-4 text-gray-700 dark:text-gray-300"
      >
        <p>
          <strong>Author:</strong>
          {{ news.username || news.user_id }}
        </p>
        <p>
          <strong>Status:</strong>
          <span class="capitalize">{{ news.status }}</span>
        </p>
        <p>
          <strong>Created At:</strong>
          {{ formatDate(news.created_at) }}
        </p>
        <p>
          <strong>Updated At:</strong>
          {{ formatDate(news.updated_at) }}
        </p>
      </div>

      <!-- Categories & Tags -->
      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="(cat, i) in news.categories"
          :key="i"
          class="bg-green-500 text-white px-2 py-1 rounded text-sm"
        >
          {{ cat }}
        </span>
        <span
          v-for="(tag, i) in news.tags"
          :key="i"
          class="bg-blue-500 text-white px-2 py-1 rounded text-sm"
        >
          {{ tag }}
        </span>
      </div>

      <!-- TipTap Content -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 class="font-semibold mb-2">Content:</h3>
        <div class="prose dark:prose-invert max-w-full">
          <div v-html="news.tiptap_html"></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-4">
        <button
          @click="editNews"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
        >
          <Icon icon="ic:round-edit" width="24" height="24" />
          <span class="ml-2">Edit</span>
        </button>

        <button
          @click="goBack"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
        >
          <Icon icon="guidance:right-arrow" width="24" height="24" />
          <span class="ml-2">Back</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      News not found.
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { Icon } from '@iconify/vue';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useNewsStore } from '~~/store/news.store';

  definePageMeta({ layout: 'admin' });

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const newsStore = useNewsStore();

  const news = ref<any | null>(null);
  const loading = ref(true);
  const newsId = route.params.id as string;

  const formatDate = (dateStr: string | undefined) =>
    dateStr
      ? new Date(dateStr).toLocaleString('bn-BD', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'নির্ধারিত নেই';

  onMounted(async () => {
    try {
      loading.value = true;
      // Fetch news if not already loaded
      if (!newsStore.newsList.length) await newsStore.fetchNewsList();

      const selected = newsStore.newsList.find((n) => n.id === newsId);
      if (selected) {
        news.value = {
          ...selected,
          tiptap_html: convertTipTapToHtml(selected.tiptap_json_for_editing),
        };
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load news!');
    } finally {
      loading.value = false;
    }
  });

  // Convert TipTap JSON to HTML
  function convertTipTapToHtml(tiptapJson: any) {
    try {
      return JSON.stringify(tiptapJson, null, 2);
    } catch {
      return 'No content';
    }
  }

  const editNews = () => {
    if (news.value) router.push(`/admin/news/${newsId}/edit`);
  };

  const goBack = () => router.push('/admin/news');
</script>
