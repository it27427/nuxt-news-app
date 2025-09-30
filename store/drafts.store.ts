// store/drafts.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Draft } from '~~/types/draft';

export const useDraftsStore = defineStore('draftsStore', () => {
  const drafts = ref<Draft[]>([]);
  const currentDraft = ref<Draft | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token found');
    return { Authorization: `Bearer ${token}` };
  };

  /**
   * Fetch drafts (list)
   */
  const fetchDrafts = async (limit = 20, offset = 0) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get<{ success: boolean; data: Draft[] }>(
        '/api/admin/drafts',
        {
          params: { limit, offset },
          headers: getAuthHeader(),
        }
      );
      drafts.value = data.data;
      return data.data;
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
   * Fetch single draft by ID
   */
  const fetchDraftById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get<Draft>(`/api/admin/drafts/${id}`, {
        headers: getAuthHeader(),
      });
      currentDraft.value = data;
      return data;
    } catch (err: any) {
      console.error('Failed to fetch draft:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch draft.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create new draft
   */
  const createDraft = async (payload: Partial<Draft>) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.post<{ message: string; draftId: string }>(
        '/api/admin/drafts',
        payload,
        { headers: getAuthHeader() }
      );

      await fetchDrafts();
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

  /**
   * Update existing draft
   */
  const updateDraft = async (id: string, payload: Partial<Draft>) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.patch<{ success: boolean; message: string }>(
        `/api/admin/drafts/${id}`,
        payload,
        { headers: getAuthHeader() }
      );

      const idx = drafts.value.findIndex((d) => d.id === id);
      if (idx !== -1) {
        drafts.value[idx] = { ...drafts.value[idx], ...payload } as Draft;
      }

      if (currentDraft.value?.id === id) {
        currentDraft.value = { ...currentDraft.value, ...payload } as Draft;
      }

      return data;
    } catch (err: any) {
      console.error('Failed to update draft:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to update draft.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete draft
   */
  const deleteDraft = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.delete<{
        success: boolean;
        message: string;
      }>(`/api/admin/drafts/${id}`, { headers: getAuthHeader() });

      drafts.value = drafts.value.filter((d) => d.id !== id);
      if (currentDraft.value?.id === id) currentDraft.value = null;

      return data;
    } catch (err: any) {
      console.error('Failed to delete draft:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to delete draft.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    drafts,
    currentDraft,
    loading,
    error,
    fetchDrafts,
    fetchDraftById,
    createDraft,
    updateDraft,
    deleteDraft,
  };
});
