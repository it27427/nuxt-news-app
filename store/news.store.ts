// store/news.store.ts
import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { SelectNews } from '~~/server/api/admin/news/[id]/index.get';
import { useCategoriesStore } from '~~/store/categories.store';
import { useTagsStore } from '~~/store/tags.store';
import type { TiptapNode } from '~~/types/newstypes';

export const useNewsStore = defineStore('newsStore', () => {
  /* --- STATES --- */
  const newsList = ref<SelectNews[]>([]);
  const singleNews = ref<SelectNews | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /* --- STORES --- */
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  /* --- COMPUTED OPTIONS --- */
  const categoryOptions = computed(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );
  const tagOptions = computed(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  /* --- UTILS --- */
  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token found');
    return { Authorization: `Bearer ${token}` };
  };

  /* --- CREATE NEWS --- */
  const createNews = async (payload: {
    categories: string[];
    tags: string[];
    tiptap_json_for_editing: TiptapNode;
  }) => {
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
        'Failed to create news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* --- FETCH NEWS LIST --- */
  const fetchNewsList = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.get('/api/admin/news', {
        params: { limit, offset },
        headers: getAuthHeader(),
      });

      /* For super_admin: data contains superAdminNews/adminNews/reporterNews */
      if (data.data?.superAdminNews) {
        newsList.value = [
          ...data.data.superAdminNews.items,
          ...data.data.adminNews.items,
          ...data.data.reporterNews.items,
        ];
      } else {
        /* For reporter/admin: data contains reviewing/pending/approved/rejected */
        const { reviewing, pending, approved, rejected } = data.data;
        newsList.value = [...reviewing, ...pending, ...approved, ...rejected];
      }

      return data;
    } catch (err: any) {
      error.value = err.response?.data?.statusMessage || 'Failed to fetch news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* --- FETCH SINGLE NEWS --- */
  const fetchSingleNews = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.get(`/api/admin/news/${id}`, {
        headers: getAuthHeader(),
      });
      singleNews.value = data.data || null;
      return data.data;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to fetch single news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* --- UPDATE NEWS --- */
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

      const updatedArticle: SelectNews = data.data;

      /* Update local newsList */
      const index = newsList.value.findIndex((n) => n.id === id);
      if (index !== -1) newsList.value[index] = updatedArticle;

      /* Update singleNews if currently opened */
      if (singleNews.value?.id === id) singleNews.value = updatedArticle;

      return updatedArticle;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to update news';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* --- DELETE NEWS --- */
  const deleteNews = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await axios.delete(`/api/admin/news/${id}`, {
        headers: getAuthHeader(),
      });

      /* Remove from local newsList and singleNews */
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
