// app/composables/useAuth.ts

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~~/store/auth.store';
import type { LoginForm, RegisterForm } from '~~/types/auth';

export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();

  const { user, loading, isAuthenticated } = storeToRefs(store);

  const logout = () => {
    store.logout();
    router.push('/auth/login');
  };

  const initializeUser = store.initialize;

  const login = async (credentials: LoginForm) => {
    await store.login(credentials);
  };

  const register = async (credentials: RegisterForm) => {
    return await store.register(credentials);
  };

  return {
    user,
    loading,
    isAuthenticated,
    initializeUser,
    logout,
    login,
    register,
  };
};
