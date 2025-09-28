// store/categories.store.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
// Assuming useAuthStore is available at this path
import { useAuthStore } from '~~/store/auth.store';

// Interface for Category structure to improve TypeScript safety
interface Category {
  id: string;
  name: string;
  created_at: string; // Typically returned as string/ISO date
  updated_at: string;
}

/**
 * Pinia Store for managing Category data and administrative actions.
 */
export const useCategoriesStore = defineStore('categoriesStore', () => {
  // State
  const categories = ref<Category[]>([]);
  const category = ref<Category | null>(null); // Single category state
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get authorization headers from the Auth store
  const authStore = useAuthStore();

  /**
   * Helper function to retrieve authorization headers.
   * @returns Auth header object.
   * @throws Error if token is missing.
   */
  const getAuthHeaders = () => {
    const token = authStore.token;
    if (!token) throw new Error('Unauthorized: No token provided');
    return { Authorization: `Bearer ${token}` };
  };

  /**
   * Fetches all categories from the authenticated public endpoint.
   */
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      // This API is assumed to be publicly accessible (GET /api/categories)
      const res = await axios.get('/api/admin/categories', {
        headers: getAuthHeaders(),
      });
      // Assuming the API returns { success: true, data: Category[] }
      categories.value = res.data.data || [];
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to load categories!';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetches a single category by its ID (Admin access: GET /api/admin/categories/:id).
   * @param id The category ID.
   * @returns The fetched category object.
   */
  const fetchCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`/api/admin/categories/${id}`, {
        headers: getAuthHeaders(),
      });
      category.value = res.data.category || null;
      return res.data.category as Category;
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
   * Creates a new category (Super Admin access: POST /api/admin/categories).
   * @param payload The category data ({ name: string }).
   * @returns The newly created category object.
   */
  const createCategory = async (payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      // UPDATED: Using /api/admin/categories for consistent admin routing
      const res = await axios.post('/api/admin/categories', payload, {
        headers: getAuthHeaders(),
      });

      if (res.data?.success) {
        const newCategory = res.data.category as Category;
        categories.value.unshift(newCategory);
        return newCategory;
      }
      throw new Error(res.data?.message || 'Category creation failed.');
    } catch (err: any) {
      // Extract validation error for specific field if available, otherwise use general message
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
   * Updates an existing category (Super Admin access: PUT /api/admin/categories/:id).
   * @param id The category ID.
   * @param payload The category data ({ name: string }).
   * @returns The updated category object.
   */
  const updateCategory = async (id: string, payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.put(`/api/admin/categories/${id}`, payload, {
        headers: getAuthHeaders(),
      });

      const updatedCategory = res.data.category as Category;

      // Update in categories array
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = updatedCategory;

      // Update single category if it matches the current view
      if (category.value?.id === id) category.value = updatedCategory;

      return updatedCategory;
    } catch (err: any) {
      // Extract validation error for specific field if available
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
   * Deletes a category by its ID (Super Admin access: DELETE /api/admin/categories/:id).
   * @param id The category ID.
   */
  const deleteCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`/api/admin/categories/${id}`, {
        headers: getAuthHeaders(),
      });
      // Remove from the list
      categories.value = categories.value.filter((c) => c.id !== id);
      // Clear single category state if it was the one deleted
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

  // Return all reactive state and actions
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
