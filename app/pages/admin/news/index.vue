<template>
  <section class="p-6">
    <h1 class="text-3xl font-bold mb-6">News List</h1>

    <div v-if="loading" class="text-gray-500">লোড হচ্ছে...</div>
    <div v-else>
      <table class="w-full table-auto border border-gray-300 rounded-md">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-2 border">#</th>
            <th class="px-4 py-2 border">Title</th>
            <th class="px-4 py-2 border">Publisher</th>
            <th class="px-4 py-2 border">Categories</th>
            <th class="px-4 py-2 border">Tags</th>
            <th class="px-4 py-2 border">Created At</th>
            <th class="px-4 py-2 border">Quill Data (JSON)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(news, index) in newsList"
            :key="news.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-4 py-2 border text-center">{{ index + 1 }}</td>
            <td class="px-4 py-2 border">
              {{ news.title || 'নির্ধারিত নেই' }}
            </td>
            <td class="px-4 py-2 border">
              {{ news.username || 'নির্ধারিত নেই' }}
            </td>
            <td class="px-4 py-2 border">
              <span
                v-for="(cat, i) in news.categories"
                :key="i"
                class="bg-green-500 text-white px-2 py-1 rounded mr-1 text-sm"
              >
                {{ cat }}
              </span>
            </td>
            <td class="px-4 py-2 border">
              <span
                v-for="(tag, i) in news.tags"
                :key="i"
                class="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-sm"
              >
                {{ tag }}
              </span>
            </td>
            <td class="px-4 py-2 border">{{ formatDate(news.created_at) }}</td>
            <td class="px-4 py-2 border">
              <pre class="max-h-64 overflow-auto text-xs">{{
                news.quill_data_for_editing
              }}</pre>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!newsList.length" class="mt-4 text-gray-500">
        কোনো সংবাদ পাওয়া যায়নি।
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useNewsStore } from '~~/store/news.store';

  definePageMeta({ layout: 'admin' });

  const newsStore = useNewsStore();
  const newsList = ref<any[]>([]);
  const loading = ref(true);

  // Fetch News List
  const fetchNews = async () => {
    loading.value = true;
    try {
      await newsStore.fetchNewsList(); // Fetch all news
      newsList.value = newsStore.newsList;
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Format Date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'নির্ধারিত নেই';
    const d = new Date(dateStr);
    return d.toLocaleString('bn-BD', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  onMounted(() => {
    fetchNews();
  });
</script>

<style scoped>
  table {
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
  }
  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
