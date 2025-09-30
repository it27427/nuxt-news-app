// store/drafts.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Draft } from '~~/types/draft';

export const useDraftsStore = defineStore('draftsStore', () => {
  const drafts = ref<Draft[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch drafts for the logged-in user
   * Super Admin sees all, others see their own drafts/pending
   * @param limit Number of drafts to fetch
   * @param offset Pagination offset
   */
  const fetchDrafts = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token found');

      const { data } = await axios.get<Draft[]>('/api/admin/drafts', {
        params: { limit, offset },
        headers: { Authorization: `Bearer ${token}` },
      });

      drafts.value = data;
      return data;
    } catch (err: any) {
      console.error('Failed to fetch drafts:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch drafts.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Save a new draft
   */
  const createDraft = async (payload: Draft) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token found');

      const { data } = await axios.post('/api/admin/drafts', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      drafts.value.push(data);
      return data;
    } catch (err: any) {
      console.error('Failed to create draft:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to create draft.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    drafts,
    loading,
    error,
    fetchDrafts,
    createDraft,
  };
});
