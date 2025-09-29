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

  // Axios instance with SSR safe token from cookie
  const getAxios = () => {
    // NOTE: This assumes 'auth_token' is available via client-side cookies
    const token = useCookie('auth_token').value;
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  /**
   * Fetches news articles requiring approval based on a given status.
   * @param status - Filter by approval_status or main status ('pending' | 'approved' | 'rejected' | 'published').
   */
  async function fetchApprovalList(
    status: 'pending' | 'approved' | 'rejected' | 'published'
  ) {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAxios().get<{
        success: boolean;
        data: ApprovalNews[];
      }>('/api/admin/approval', { params: { status } });
      approvalList.value = res.data.data;
    } catch (err: any) {
      console.error('Approval list fetch error:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch approval list.';
      throw err; // Re-throw for component handling
    } finally {
      loading.value = false;
    }
  }

  /**
   * Sends an approval or rejection action for a specific news article.
   * @param newsId - The ID of the article to act upon.
   * @param newApprovalStatus - 'approved' or 'rejected'.
   * @param comment - Optional comment from the Super Admin.
   */
  async function takeAction(
    newsId: string,
    newApprovalStatus: 'approved' | 'rejected',
    comment?: string
  ) {
    try {
      const res = await getAxios().post(`/api/admin/approval/${newsId}`, {
        newApprovalStatus,
        comment,
      });
      // Optionally update the local list upon success
      approvalList.value = approvalList.value.filter((a) => a.id !== newsId);
      return res.data;
    } catch (err: any) {
      console.error('Approval action error:', err);
      throw new Error(
        err?.response?.data?.statusMessage || 'Approval action failed.'
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
