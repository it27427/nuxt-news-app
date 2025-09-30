// store/approval.store.ts

import { useCookie } from '#imports';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ApprovalNews } from '~~/types/approval';

export const useApprovalStore = defineStore('approvalStore', () => {
  const approvalList = ref<ApprovalNews[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // --- Axios instance with SSR safe token ---
  const getAxios = () => {
    const token =
      useCookie('auth_token')?.value || localStorage.getItem('auth_token');
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  /**
   * Fetch all news requiring approval, categorized by status
   */
  const fetchApprovalList = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAxios().get<{
        success: boolean;
        data: {
          reviewing: ApprovalNews[];
          pending: ApprovalNews[];
          approved: ApprovalNews[];
          rejected: ApprovalNews[];
        };
      }>('/api/admin/approval/list');

      // Merge all categories into a single array if needed, or keep separate
      approvalList.value = [
        ...res.data.data.reviewing,
        ...res.data.data.pending,
        ...res.data.data.approved,
        ...res.data.data.rejected,
      ];
      return res.data.data;
    } catch (err: any) {
      console.error('Failed to fetch approval list:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch approval list.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Take an approval action (approve, reject, pending) on a specific news article
   * @param newsId - The ID of the news
   * @param newApprovalStatus - 'pending' | 'approved' | 'rejected'
   * @param comment - Optional comment from super admin
   */
  const takeAction = async (
    newsId: string,
    newApprovalStatus: 'pending' | 'approved' | 'rejected',
    comment?: string
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAxios().post(`/api/admin/approval/${newsId}`, {
        newApprovalStatus,
        comment,
      });

      // Remove the news from local approvalList after action
      approvalList.value = approvalList.value.filter((a) => a.id !== newsId);

      return res.data;
    } catch (err: any) {
      console.error('Approval action failed:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Approval action failed.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    approvalList,
    loading,
    error,
    fetchApprovalList,
    takeAction,
  };
});
