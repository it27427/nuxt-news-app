// store/approval.store.ts
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ApprovalNews {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  approval_status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useApprovalStore = defineStore('approvalStore', () => {
  const approvalList = ref<ApprovalNews[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchApprovalList(
    status: 'pending' | 'approved' | 'rejected' | 'published'
  ) {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get<{ success: boolean; data: ApprovalNews[] }>(
        '/api/admin/approval',
        { params: { status } }
      );
      approvalList.value = res.data.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || 'Failed to fetch approval list.';
    } finally {
      loading.value = false;
    }
  }

  async function takeAction(
    newsId: string,
    newApprovalStatus: 'approved' | 'rejected',
    comment?: string
  ) {
    try {
      const res = await axios.post(`/api/admin/approval/${newsId}`, {
        newApprovalStatus,
        comment,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || 'Approval action failed.'
      );
    }
  }

  return {
    approvalList,
    loading,
    error,
    fetchApprovalList,
    takeAction,
  };
});
