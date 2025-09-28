// store/notifications.store.ts
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

  async function fetchNotifications(limit = 20, offset = 0, read?: boolean) {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get<Notification[]>('/api/admin/notifications', {
        params: { limit, offset, read },
      });
      notifications.value = res.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || 'Failed to fetch notifications.';
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
