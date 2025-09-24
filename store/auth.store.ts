import axios from 'axios';
import { defineStore } from 'pinia';
import type { UserType } from '~~/types/admin';
import type { LoginForm, RegisterForm } from '~~/types/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserType | null,
    loading: false,
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(credentials: LoginForm) {
      try {
        this.loading = true;
        const response = await axios.post('/api/auth/login', credentials);
        const { user, token } = response.data;
        this.user = user;
        this.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async register(credentials: RegisterForm) {
      try {
        this.loading = true;
        const response = await axios.post('/api/auth/register', credentials);
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    initialize() {
      if (import.meta.client) {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
          try {
            this.user = JSON.parse(storedUser);
            this.token = storedToken;
          } catch (e) {
            this.logout();
            console.error('Failed to parse user data from localStorage.');
          }
        }
      }
      this.loading = false;
    },
  },
});
