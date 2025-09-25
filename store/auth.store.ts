// store/auth.store.ts

import { useCookie } from '#app';
import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { UserType } from '~~/types/admin';
import type { LoginForm, RegisterForm } from '~~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserType | null>(null);
  const loading = ref(false);
  const token = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);

  // Actions
  async function login(credentials: LoginForm) {
    try {
      loading.value = true;
      const response = await axios.post('/api/auth/login', credentials);
      const { user: userData, token: userToken } = response.data;

      user.value = userData;
      token.value = userToken;

      const authToken = useCookie('auth_token');
      authToken.value = userToken;

      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      logout();
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function register(credentials: RegisterForm) {
    try {
      loading.value = true;
      const response = await axios.post('/api/auth/register', credentials);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;

    const authToken = useCookie('auth_token');
    authToken.value = null;

    if (import.meta.client) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  async function initialize() {
    if (import.meta.client) {
      const authToken = useCookie('auth_token');
      if (authToken.value) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            user.value = JSON.parse(storedUser);
            token.value = authToken.value;
          }
        } catch (e) {
          logout();
          console.error('Failed to initialize user from localStorage.');
        }
      }
    }
    loading.value = false;
  }

  // Exposed State & Actions
  return {
    user,
    loading,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initialize,
  };
});
