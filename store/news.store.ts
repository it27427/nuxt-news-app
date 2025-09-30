// store/news.store.ts
import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ArticleCreationPayload, NewsArticle } from '~~/types/article';
import type { Draft } from '~~/types/draft';
import type { TiptapNode } from '~~/types/newstypes';
import { useCategoriesStore } from './categories.store';
import { useTagsStore } from './tags.store';

export const useNewsStore = defineStore('newsStore', () => {
  // --- STATES ---
  const newsList = ref<NewsArticle[]>([]);
  const singleNews = ref<NewsArticle | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const drafts = ref<Draft[]>([]);
  const draftsLoading = ref(false);
  const draftsError = ref<string | null>(null);

  // --- STORES ---
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  // --- COMPUTED OPTIONS ---
  const categoryOptions = computed(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );
  const tagOptions = computed(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  // --- UTILS ---
  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token found');
    return { Authorization: `Bearer ${token}` };
  };

  // --- CREATE ARTICLE ---
  const createArticle = async (payload: ArticleCreationPayload) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.post('/api/admin/news', payload, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage ||
        err.message ||
        'Failed to create article';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createDraft = (payload: ArticleCreationPayload) =>
    createArticle(payload);
  const createPendingNews = (payload: ArticleCreationPayload) =>
    createArticle(payload);
  const createApprovedNews = (payload: ArticleCreationPayload) =>
    createArticle(payload);

  // --- FETCH DRAFTS ---
  const fetchDrafts = async (limit = 20, offset = 0) => {
    draftsLoading.value = true;
    draftsError.value = null;

    try {
      const { data } = await axios.get<Draft[]>('/api/admin/drafts', {
        params: { limit, offset },
        headers: getAuthHeader(),
      });

      drafts.value = data;
      return data;
    } catch (err: any) {
      draftsError.value =
        err?.response?.data?.statusMessage || 'Failed to fetch drafts';
      throw err;
    } finally {
      draftsLoading.value = false;
    }
  };

  // --- FETCH NEWS LIST ---
  const fetchNewsList = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.get('/api/admin/news', {
        params: { limit, offset },
        headers: getAuthHeader(),
      });
      newsList.value = data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.statusMessage || 'Failed to fetch news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // --- FETCH SINGLE NEWS ---
  const fetchSingleNews = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.get(`/api/admin/news/${id}`, {
        headers: getAuthHeader(),
      });
      singleNews.value = data.data || null;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to fetch single news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // --- UPDATE NEWS ---
  const updateNews = async (
    id: string,
    payload: {
      categories?: string[];
      tags?: string[];
      tiptap_json_for_editing?: TiptapNode;
    }
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.put(`/api/admin/news/${id}`, payload, {
        headers: getAuthHeader(),
      });

      const updatedArticle: NewsArticle = data.data;
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

  // --- DELETE NEWS ---
  const deleteNews = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.delete(`/api/admin/news/${id}`, {
        headers: getAuthHeader(),
      });
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
    drafts,
    draftsLoading,
    draftsError,
    categoryOptions,
    tagOptions,
    createDraft,
    createPendingNews,
    createApprovedNews,
    createArticle,
    fetchDrafts,
    fetchNewsList,
    fetchSingleNews,
    updateNews,
    deleteNews,
  };
});
