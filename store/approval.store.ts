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

  // Axios instance with SSR safe token from cookie
  const getAxios = () => {
    const token = useCookie('auth_token').value;
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

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
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch approval list.';
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
      const res = await getAxios().post(`/api/admin/approval/${newsId}`, {
        newApprovalStatus,
        comment,
      });
      return res.data;
    } catch (err: any) {
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
