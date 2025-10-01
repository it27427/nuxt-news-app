// store/categories.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { axiosWithAuth } from '~~/shared/axiosWithAuth';
import type { Category } from '~~/types/category';

/**
 * Pinia Store for managing Category data and administrative actions.
 */
export const useCategoriesStore = defineStore('categoriesStore', () => {
  // State
  const categories = ref<Category[]>([]);
  const category = ref<Category | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all categories
   */
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{
        success: boolean;
        data: Category[];
      }>('/api/admin/categories');
      categories.value = res.data.data || [];
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to load categories!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single category by ID
   */
  const fetchCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{
        success: boolean;
        category: Category;
      }>(`/api/admin/categories/${id}`);
      category.value = res.data.category || null;
      return res.data.category;
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to load category!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new category
   */
  const createCategory = async (payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().post<{
        success: boolean;
        category: Category;
        message?: string;
      }>('/api/admin/categories', payload);
      if (res.data?.success) {
        categories.value.unshift(res.data.category);
        return res.data.category;
      }
      throw new Error(res.data?.message || 'Category creation failed.');
    } catch (err: any) {
      const validationError =
        err.response?.data?.data?.name || err.response?.data?.message;
      error.value =
        validationError || err.message || 'Failed to create category!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing category
   */
  const updateCategory = async (id: string, payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().put<{
        success: boolean;
        category: Category;
      }>(`/api/admin/categories/${id}`, payload);
      const updatedCategory = res.data.category;

      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = updatedCategory;

      if (category.value?.id === id) category.value = updatedCategory;

      return updatedCategory;
    } catch (err: any) {
      const validationError =
        err.response?.data?.data?.name || err.response?.data?.message;
      error.value =
        validationError || err.message || 'Failed to update category!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosWithAuth().delete(`/api/admin/categories/${id}`);
      categories.value = categories.value.filter((c) => c.id !== id);
      if (category.value?.id === id) category.value = null;
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete category!';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    category,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
});
