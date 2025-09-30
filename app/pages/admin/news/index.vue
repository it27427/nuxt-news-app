<template>
  <section class="md:p-5 flex flex-col gap-6">
    <!-- Title -->
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      <template v-if="loading">
        <div
          class="h-8 w-48 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
        ></div>
      </template>
      <template v-else>সংরক্ষিত সংবাদ তালিকা</template>
    </h2>

    <!-- Table -->
    <table
      class="bg-gray-50 dark:bg-dark border border-gray-300 dark:border-slate-700 text-lg text-center w-full mt-4"
    >
      <thead class="bg-gray-100 dark:bg-dark">
        <tr>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            #
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            শিরোনাম
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            লেখক
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            শ্রেণী
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ট্যাগ
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            তারিখ
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            সংবাদ
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Skeleton -->
        <tr v-if="loading" v-for="n in 5" :key="'skeleton-' + n">
          <td
            colspan="7"
            class="px-4 py-3 border border-gray-300 dark:border-slate-700"
          >
            <div
              class="h-6 w-full bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
        </tr>

        <!-- Empty -->
        <tr v-else-if="!newsList.length">
          <td colspan="7" class="py-6 text-gray-400 text-center">
            কোনো সংবাদ পাওয়া যায়নি।
          </td>
        </tr>

        <!-- Data -->
        <tr
          v-else
          v-for="(news, index) in newsList"
          :key="news.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="px-4 py-2 border">{{ index + 1 }}</td>
          <td class="px-4 py-2 border">{{ news.title || 'নির্ধারিত নেই' }}</td>
          <td class="px-4 py-2 border">{{ news.username || 'Unknown' }}</td>
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

          <!-- TipTap Content Preview -->
          <td class="px-4 py-2 border">
            <div
              class="bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-48 overflow-auto text-sm"
            >
              <pre>{{ news.tiptap_json_for_editing }}</pre>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useNewsStore } from '~~/store/news.store';

  definePageMeta({ layout: 'admin' });

  const newsStore = useNewsStore();
  const newsList = ref<any[]>([]);
  const loading = ref(true);

  const fetchNews = async () => {
    loading.value = true;
    try {
      await newsStore.fetchNewsList();
      newsList.value = newsStore.newsList;
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Format date
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

<style lang="scss" scoped>
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
    font-family: monospace;
  }
</style>
