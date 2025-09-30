// store/news.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { SelectNews } from '~~/server/api/admin/news/[id]/index.get';
import { useCategoriesStore } from '~~/store/categories.store';
import { useDraftsStore } from '~~/store/drafts.store';
import { useTagsStore } from '~~/store/tags.store';
import type { TiptapNode } from '~~/types/newstypes';

export const useNewsStore = defineStore('newsStore', () => {
  const newsList = ref<SelectNews[]>([]);
  const singleNews = ref<SelectNews | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();
  const draftsStore = useDraftsStore();

  const categoryOptions = computed(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );
  const tagOptions = computed(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token found');
    return { Authorization: `Bearer ${token}` };
  };

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

      // Sync draft
      if (draftsStore.currentDraft) {
        await draftsStore.updateDraft(draftsStore.currentDraft.id, {
          tiptap_json_for_editing: payload.tiptap_json_for_editing,
        });
      }

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

      const index = newsList.value.findIndex((n) => n.id === id);
      if (index !== -1) newsList.value[index] = updatedArticle;
      if (singleNews.value?.id === id) singleNews.value = updatedArticle;

      // Sync draft
      if (draftsStore.currentDraft && payload.tiptap_json_for_editing) {
        await draftsStore.updateDraft(draftsStore.currentDraft.id, {
          tiptap_json_for_editing: payload.tiptap_json_for_editing,
        });
      }

      return updatedArticle;
    } catch (err: any) {
      error.value =
        err.response?.data?.statusMessage || 'Failed to update news';
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
    updateNews,
  };
});
