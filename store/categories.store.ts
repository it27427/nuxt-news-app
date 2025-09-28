import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '~~/store/auth.store';

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const categories = ref<any[]>([]);
  const category = ref<any>(null); // single category
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore(); // Get authorization headers

  const getAuthHeaders = () => {
    const token = authStore.token;
    if (!token) throw new Error('Unauthorized: No token provided');
    return { Authorization: `Bearer ${token}` };
  }; // Fetch all categories

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get('/api/admin/categories', {
        headers: getAuthHeaders(),
      });
      categories.value = res.data.data || [];
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to load categories!';
    } finally {
      loading.value = false;
    }
  }; // Fetch single category by id

  const fetchCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`/api/admin/categories/${id}`, {
        headers: getAuthHeaders(),
      }); // FIX: Assign the fetched category to the singular 'category' ref.
      category.value = res.data.category || null; // Return the fetched object directly to the component for immediate use.
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
  }; // Create a category

  const createCategory = async (payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.post('/api/admin/categories', payload, {
        headers: getAuthHeaders(),
      });
      if (res.data?.success) {
        // Add the new category to the beginning of the list
        categories.value.unshift(res.data.category);
        return res.data.category;
      }
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to create category!';
      throw err;
    } finally {
      loading.value = false;
    }
  }; // Update a category

  const updateCategory = async (id: string, payload: { name: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.put(`/api/admin/categories/${id}`, payload, {
        headers: getAuthHeaders(),
      }); // Update in categories array
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = res.data.category; // Update single category if it matches
      if (category.value?.id === id) category.value = res.data.category;
      return res.data.category;
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to update category!';
      throw err;
    } finally {
      loading.value = false;
    }
  }; // Delete a category

  const deleteCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`/api/admin/categories/${id}`, {
        headers: getAuthHeaders(),
      });
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
