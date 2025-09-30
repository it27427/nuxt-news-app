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

  // --- Axios instance with auth token ---
  const getAxios = () => {
    const token =
      useCookie('auth_token')?.value || localStorage.getItem('auth_token');
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  /**
   * Fetch notifications
   * @param limit number of notifications
   * @param offset pagination offset
   * @param read filter by read status: true, false, or undefined
   */
  const fetchNotifications = async (limit = 20, offset = 0, read?: boolean) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAxios().get<{
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
      console.error('Failed to fetch notifications:', err);
      error.value =
        err?.response?.data?.statusMessage || 'Failed to fetch notifications.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Mark a notification as read
   */
  const markAsRead = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await getAxios().patch(`/api/admin/notifications/${id}`, { read: true });

      // TS-safe update
      const idx = notifications.value.findIndex((n) => n.id === id);
      if (idx !== -1) {
        notifications.value[idx]!.read = true;
      }
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
      error.value =
        err?.response?.data?.statusMessage ||
        'Failed to mark notification as read.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a notification
   */
  const deleteNotification = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await getAxios().delete(`/api/admin/notifications/${id}`);
      notifications.value = notifications.value.filter((n) => n.id !== id);
    } catch (err: any) {
      console.error('Failed to delete notification:', err);
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
