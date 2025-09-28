// store/news.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCategoriesStore } from '~~/store/categories.store';
import { useTagsStore } from '~~/store/tags.store';

// Types
export interface NewsArticle {
  id: string;
  user_id: string;
  username: string;
  status: 'draft' | 'published';
  approval_status: 'draft' | 'pending' | 'approved';
  categories: string[];
  tags: string[];
  title: string;
  subtitle?: string;
  homepage_excerpt: any[];
  full_content: any[];
  images?: Array<{ img_src: string; caption: string; credit: string }>;
  videos?: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;
  quill_data_for_editing: any;
  created_at?: string;
  updated_at?: string;
}

export const useNewsStore = defineStore('newsStore', () => {
  // State
  const newsList = ref<NewsArticle[]>([]);
  const singleNews = ref<NewsArticle | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Stores for categories and tags
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  // Computed options for dropdowns
  const categoryOptions = computed(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );

  const tagOptions = computed(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  // ✅ Create News
  const createNews = async (payload: {
    userId: string;
    username: string;
    userRole: 'admin' | 'super_admin';
    categories: string[];
    tags: string[];
    quill_data_for_editing: any;
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

  // ✅ Fetch News List
  const fetchNewsList = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get('/api/admin/news', {
        params: { limit, offset },
      });
      newsList.value = data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.statusMessage || 'Failed to fetch news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch Single News by ID
  const fetchSingleNews = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(`/api/admin/news/${id}`);
      singleNews.value = data.data || null;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to fetch single news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update News
  const updateNews = async (
    id: string,
    payload: {
      categories?: string[];
      tags?: string[];
      quill_data_for_editing?: any;
    }
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.put(`/api/admin/news/${id}`, payload);
      const index = newsList.value.findIndex((n) => n.id === id);
      if (index !== -1) newsList.value[index] = data.data;
      if (singleNews.value?.id === id) singleNews.value = data.data;
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to update news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Delete News
  const deleteNews = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.delete(`/api/admin/news/${id}`);
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
