import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define types for better code clarity
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  isDefaultSuperAdmin: boolean;
}

interface UserCreationForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserUpdateForm {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export const useUsersStore = defineStore('users', () => {
  // State variables for managing user data and UI state
  const users = ref<User[]>([]);
  const selectedUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);

  /**
   * Creates a new user by calling the API.
   * @param form The user data to be created.
   */
  const createUser = async (form: UserCreationForm) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/api/admin/users/create', form);
      await fetchUsers();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetches all users from the API and updates the state.
   */
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('/api/admin/users');
      users.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch users.';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetches a single user by their ID.
   * @param id The ID of the user to fetch.
   */
  const fetchUser = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      selectedUser.value = response.data.user;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Updates an existing user's data.
   * @param id The ID of the user to update.
   * @param form The user's updated data.
   */
  const updateUser = async (id: string, form: UserUpdateForm) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`/api/admin/users/${id}`, form);
      await fetchUsers();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update user.';
      throw err; // Re-throw the error for component-level handling
    } finally {
      loading.value = false;
    }
  };

  /**
   * Deletes a user by their ID.
   * @param id The ID of the user to delete.
   */
  const deleteUser = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.delete(`/api/admin/users/${id}`);
      users.value = users.value.filter((user) => user.id !== id);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete user.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Expose state and actions for use in components
  return {
    users,
    selectedUser,
    loading,
    error,
    createUser,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
  };
});
