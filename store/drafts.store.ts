// store/drafts.store.ts
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Author টাইপ
export interface Author {
  id: string;
  name: string;
  email: string;
}

// Draft টাইপ
export interface Draft {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'pending';
  user_id: string;
  created_at: string;
  updated_at: string;
  author?: Author; // ✅ optional author field
}

export const useDraftsStore = defineStore('draftsStore', () => {
  const drafts = ref<Draft[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDrafts(limit = 20, offset = 0) {
    loading.value = true;
    error.value = null;
    try {
      // এখানে Draft[] টাইপ use করা হলো, যাতে author field optional ধরা হয়
      const res = await axios.get<Draft[]>('/api/admin/drafts', {
        params: { limit, offset },
      });
      drafts.value = res.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to fetch drafts.';
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
