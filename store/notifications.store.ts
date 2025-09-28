// store/notifications.store.ts

import { useCookie } from '#imports'; // Nuxt 4 composable
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notification {
  id: string;
  user_id: string;
  related_article_id?: string;
  message: string;
  is_read: boolean;
  type: 'system' | 'approval' | 'status_change';
  created_at: string;
}

export const useNotificationsStore = defineStore('notificationsStore', () => {
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // SSR safe axios instance
  const getAxios = () => {
    const token = useCookie('auth_token').value;
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  async function fetchNotifications(limit = 20, offset = 0, read?: boolean) {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAxios().get<{
        success: boolean;
        data: Notification[];
      }>('/api/admin/notifications', { params: { limit, offset, read } });
      notifications.value = res.data.data || [];
    } catch (err: any) {
      console.error('Notifications fetch error:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch notifications.';
    } finally {
      loading.value = false;
    }
  }

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
  };
});
