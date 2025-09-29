// store/notifications.store.ts

import { useCookie } from '#imports';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from '~~/types/notification';

export const useNotificationsStore = defineStore('notificationsStore', () => {
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // SSR safe axios instance
  const getAxios = () => {
    // NOTE: Assumes client-side token access via cookie.
    const token = useCookie('auth_token').value;
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  /**
   * Fetches user notifications from the API.
   * @param limit - Max number of notifications to fetch.
   * @param offset - Pagination offset.
   * @param read - Optional filter: true (read) or false (unread).
   */
  async function fetchNotifications(limit = 20, offset = 0, read?: boolean) {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAxios().get<{
        success: boolean;
        data: Notification[];
      }>('/api/admin/notifications', {
        params: {
          limit,
          offset,
          // Convert boolean filter to 'true'/'false' string as expected by the API
          read: read === true ? 'true' : read === false ? 'false' : undefined,
        },
      });
      notifications.value = res.data.data || [];
    } catch (err: any) {
      console.error('Notifications fetch error:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch notifications.';
      throw err;
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
