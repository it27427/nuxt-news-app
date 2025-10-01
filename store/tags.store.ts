// store/tags.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { axiosWithAuth } from '~~/shared/axiosWithAuth';
import type { Tag } from '~~/types/tag';

export const useTagsStore = defineStore('tagsStore', () => {
  const tags = ref<Tag[]>([]);
  const tag = ref<Tag | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all tags
   */
  const fetchTags = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{ success: boolean; data: Tag[] }>(
        '/api/admin/tags'
      );
      tags.value = res.data.data || [];
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to load tags!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single tag by ID
   */
  const fetchTag = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{ success: boolean; tag: Tag }>(
        `/api/admin/tags/${id}`
      );
      tag.value = res.data.tag || null;
      return res.data.tag;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to load tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new tag
   */
  const createTag = async (payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().post<{
        success: boolean;
        tag: Tag;
        message?: string;
      }>('/api/admin/tags', payload);
      if (res.data.success) {
        tags.value.unshift(res.data.tag);
        return res.data.tag;
      }
      throw new Error(res.data.message || 'Tag creation failed.');
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to create tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update a tag
   */
  const updateTag = async (id: string, payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().put<{
        success: boolean;
        tag: Tag;
        message?: string;
      }>(`/api/admin/tags/${id}`, payload);
      const updatedTag = res.data.tag;

      const index = tags.value.findIndex((t) => t.id === id);
      if (index !== -1) tags.value[index] = updatedTag;

      if (tag.value?.id === id) tag.value = updatedTag;

      return updatedTag;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.message || 'Failed to update tag!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a tag
   */
  const deleteTag = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosWithAuth().delete(`/api/admin/tags/${id}`);
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
