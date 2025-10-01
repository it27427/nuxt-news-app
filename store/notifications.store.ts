// store/notifications.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { axiosWithAuth } from '~~/shared/axiosWithAuth';
import type { Notification } from '~~/types/notification';

export const useNotificationsStore = defineStore('notificationsStore', () => {
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchNotifications = async (limit = 20, offset = 0, read?: boolean) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{
        success: boolean;
        message: string;
        data: Notification[];
      }>('/api/admin/notifications', {
        params: {
          limit,
          offset,
          read: read === true ? 'true' : read === false ? 'false' : undefined,
        },
      });
      notifications.value = res.data.data || [];
      return notifications.value;
    } catch (err: any) {
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch notifications.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosWithAuth().patch(`/api/admin/notifications/${id}`, {
        read: true,
      });
      const idx = notifications.value.findIndex((n) => n.id === id);
      if (idx !== -1) notifications.value[idx]!.read = true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.statusMessage ||
        'Failed to mark notification as read.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteNotification = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosWithAuth().delete(`/api/admin/notifications/${id}`);
      notifications.value = notifications.value.filter((n) => n.id !== id);
    } catch (err: any) {
      error.value =
        err?.response?.data?.statusMessage || 'Failed to delete notification.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  };
});
