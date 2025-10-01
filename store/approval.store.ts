// store/approval.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { axiosWithAuth } from '~~/shared/axiosWithAuth';
import type { ApprovalNews } from '~~/types/approval';

export const useApprovalStore = defineStore('approvalStore', () => {
  const approvalList = ref<ApprovalNews[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchApprovalList = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{
        success: boolean;
        data: {
          reviewing: ApprovalNews[];
          pending: ApprovalNews[];
          approved: ApprovalNews[];
          rejected: ApprovalNews[];
        };
      }>('/api/admin/approval/list');

      approvalList.value = [
        ...res.data.data.reviewing,
        ...res.data.data.pending,
        ...res.data.data.approved,
        ...res.data.data.rejected,
      ];

      return res.data.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch approval list.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const takeAction = async (
    newsId: string,
    newApprovalStatus: 'pending' | 'approved' | 'rejected',
    comment?: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().post(`/api/admin/approval/${newsId}`, {
        newApprovalStatus,
        comment,
      });
      approvalList.value = approvalList.value.filter((a) => a.id !== newsId);
      return res.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.statusMessage || 'Approval action failed.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { approvalList, loading, error, fetchApprovalList, takeAction };
});
