// store/users.store.ts
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '~~/store/auth.store';
import type { User, UserCreationForm, UserUpdateForm } from '~~/types/users';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const selectedUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  const getAuthHeaders = () => {
    const token = authStore.token;
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('/api/admin/users', getAuthHeaders());
      users.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch users.';
      users.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchUser = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        `/api/admin/users/${id}`,
        getAuthHeaders()
      );
      selectedUser.value = response.data.user;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (form: UserCreationForm) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.post('/api/admin/users/create', form, getAuthHeaders());
      await fetchUsers();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: string, form: UserUpdateForm) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.put(`/api/admin/users/${id}`, form, getAuthHeaders());
      await fetchUsers();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`/api/admin/users/${id}`, getAuthHeaders());
      users.value = users.value.filter((u) => u.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  };
});
