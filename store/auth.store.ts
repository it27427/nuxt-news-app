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

        const authToken = useCookie('auth_token');
        authToken.value = token;
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

      const authToken = useCookie('auth_token');
      authToken.value = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    async initialize() {
      const authToken = useCookie('auth_token');
      if (authToken.value) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.token = authToken.value;
          }
        } catch (e) {
          this.logout();
          console.error('Failed to initialize user from cookie.');
        }
      }
      this.loading = false;
    },
  },
});
