// store/news.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- Types ---
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
  homepage_excerpt?: string;
  full_content: any;
  images?: any[];
  videos?: any[];
  quill_data_for_editing: any;
  created_at?: string;
  updated_at?: string;
}

// --- Pinia Store ---
export const useNewsStore = defineStore('newsStore', () => {
  const newsList = ref<NewsArticle[]>([]);
  const singleNews = ref<NewsArticle | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ✅ Create News
  const createNews = async (payload: any) => {
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

  // ✅ Get All News (with pagination)
  const fetchNewsList = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get('/api/admin/news', {
        params: { limit, offset },
      });
      newsList.value = data;
    } catch (err: any) {
      error.value = err.response?.data?.statusMessage || 'Failed to fetch news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Get Single News by ID
  const fetchSingleNews = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(`/api/admin/news/${id}`);
      singleNews.value = data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to fetch single news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update News
  const updateNews = async (id: string, payload: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.put(`/api/admin/news/${id}`, payload);
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
      // delete করার পর newsList থেকে remove করে দিব
      newsList.value = newsList.value.filter((n) => n.id !== id);
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
    createNews,
    fetchNewsList,
    fetchSingleNews,
    updateNews,
    deleteNews,
  };
});
