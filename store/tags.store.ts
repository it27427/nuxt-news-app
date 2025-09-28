// store/tags.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '~~/store/auth.store';

export const useTagsStore = defineStore('tagsStore', () => {
  const tags = ref<any[]>([]);
  const tag = ref<any>(null); // single tag
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore(); // Get authorization headers

  const getAuthHeaders = () => {
    const token = authStore.token;
    if (!token) throw new Error('Unauthorized: No token provided');
    return { Authorization: `Bearer ${token}` };
  }; // Fetch all tags

  const fetchTags = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get('/api/admin/tags', {
        headers: getAuthHeaders(),
      });
      tags.value = res.data.data || [];
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to load tags!';
    } finally {
      loading.value = false;
    }
  }; // Fetch single tag by id

  const fetchTag = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`/api/admin/tags/${id}`, {
        headers: getAuthHeaders(),
      });
      tag.value = res.data.tag || null;
      return res.data.tag; // Return the raw object for component use
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to load tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  }; // Create a tag

  const createTag = async (payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.post('/api/admin/tags', payload, {
        headers: getAuthHeaders(),
      });
      if (res.data?.success) {
        // Add the new tag to the beginning of the list
        tags.value.unshift(res.data.tag);
        return res.data.tag;
      }
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to create tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  }; // Update a tag

  const updateTag = async (id: string, payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.put(`/api/admin/tags/${id}`, payload, {
        headers: getAuthHeaders(),
      }); // Update in tags array
      const index = tags.value.findIndex((t) => t.id === id);
      if (index !== -1) tags.value[index] = res.data.tag; // Update single tag if it matches
      if (tag.value?.id === id) tag.value = res.data.tag;
      return res.data.tag;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to update tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  }; // Delete a tag

  const deleteTag = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`/api/admin/tags/${id}`, {
        headers: getAuthHeaders(),
      });
      tags.value = tags.value.filter((t) => t.id !== id);
      if (tag.value?.id === id) tag.value = null;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to delete tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    tags,
    tag,
    loading,
    error,
    fetchTags,
    fetchTag,
    createTag,
    updateTag,
    deleteTag,
  };
});
