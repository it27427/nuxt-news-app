// store/tagss.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { useAuthStore } from '~~/store/auth.store';

export const useTagStore = defineStore('tagStore', () => {
  const tags = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  const getAuthHeaders = () => {
    const token = authStore.token;
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      loading.value = true;
      const res = await axios.get('/api/admin/tags', {
        headers: getAuthHeaders(),
      });
      tags.value = res.data.data || [];
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Create a tag
  const createTag = async (payload: { name: string }) => {
    try {
      loading.value = true;
      const res = await axios.post('/api/admin/tags/create', payload, {
        headers: getAuthHeaders(),
      });
      if (res.data?.success) {
        tags.value.unshift(res.data.data);
      }
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update tag
  const updateTag = async (id: string, payload: { name: string }) => {
    try {
      loading.value = true;
      const res = await axios.put(`/api/admin/tags/${id}`, payload, {
        headers: getAuthHeaders(),
      });
      const index = tags.value.findIndex((t) => t.id === id);
      if (index !== -1) tags.value[index] = res.data.data;
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete tag
  const deleteTag = async (id: string) => {
    try {
      loading.value = true;
      await axios.delete(`/api/admin/tags/${id}`, {
        headers: getAuthHeaders(),
      });
      tags.value = tags.value.filter((t) => t.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
});
