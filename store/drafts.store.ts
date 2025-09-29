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
   * Fetches user drafts and pending articles from the API.
   * Filters based on user role (super_admin sees all, others see their own).
   * @param limit - Max number of articles to fetch.
   * @param offset - Pagination offset.
   */
  async function fetchDrafts(limit = 20, offset = 0) {
    loading.value = true;
    error.value = null;
    try {
      // The API returns the full SelectNews structure, mapped to the comprehensive Draft type
      const res = await axios.get<Draft[]>('/api/admin/drafts', {
        params: { limit, offset },
      });
      // The fetched data now correctly includes Tiptap JSON content fields
      drafts.value = res.data;
    } catch (err: any) {
      console.error('Drafts fetch error:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch drafts.';
      // Throw the error for component handling
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    drafts,
    loading,
    error,
    fetchDrafts,
  };
});
