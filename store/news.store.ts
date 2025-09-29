// store/news.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCategoriesStore } from '~~/store/categories.store';
import { useTagsStore } from '~~/store/tags.store';
// 💡 FIXED: 'type' keyword added for type-only import to resolve TS1484 error
import type { NewsArticle } from '~~/types/article';
import type { TiptapNode } from '~~/types/newstypes';

export const useNewsStore = defineStore('newsStore', () => {
  // State
  const newsList = ref<NewsArticle[]>([]);
  const singleNews = ref<NewsArticle | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Stores for categories and tags (Assuming these exist and work)
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  // Computed options for dropdowns (Assuming the stores are populated)
  const categoryOptions = computed(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );

  const tagOptions = computed(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  // ✅ Create News (POST)
  const createNews = async (payload: {
    userId: string;
    username: string;
    userRole: 'admin' | 'super_admin';
    categories: string[];
    tags: string[];
    // 💡 UPDATED: Use new Tiptap JSON field name and type
    tiptap_json_for_editing: TiptapNode;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.post('/api/admin/news', payload);
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to create news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch News List (GET)
  const fetchNewsList = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get('/api/admin/news', {
        params: { limit, offset },
      });
      // The fetched data structure now uses tiptap_json_for_editing
      newsList.value = data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.statusMessage || 'Failed to fetch news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch Single News by ID (GET)
  const fetchSingleNews = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(`/api/admin/news/${id}`);
      // The fetched data structure now uses tiptap_json_for_editing
      singleNews.value = data.data || null;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to fetch single news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update News (PUT)
  const updateNews = async (
    id: string,
    payload: {
      categories?: string[];
      tags?: string[];
      // 💡 UPDATED: Use new Tiptap JSON field name and type
      tiptap_json_for_editing?: TiptapNode;
    }
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.put(`/api/admin/news/${id}`, payload);
      const updatedArticle: NewsArticle = data.data;

      // Update local state
      const index = newsList.value.findIndex((n) => n.id === id);
      if (index !== -1) newsList.value[index] = updatedArticle;
      if (singleNews.value?.id === id) singleNews.value = updatedArticle;

      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to update news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Delete News (DELETE)
  const deleteNews = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.delete(`/api/admin/news/${id}`);
      // Remove from list after successful deletion
      newsList.value = newsList.value.filter((n) => n.id !== id);
      if (singleNews.value?.id === id) singleNews.value = null;
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to delete news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    newsList,
    singleNews,
    loading,
    error,
    categoryOptions,
    tagOptions,
    createNews,
    fetchNewsList,
    fetchSingleNews,
    updateNews,
    deleteNews,
  };
});
