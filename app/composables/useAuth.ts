import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~~/store/auth';

export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();

  const { user, loading, isAuthenticated } = storeToRefs(store);

  const logout = () => {
    store.logout();
    router.push('/auth/login');
  };

  const initializeUser = store.initialize;
  const login = store.login;

  return {
    user,
    loading,
    isAuthenticated,
    initializeUser,
    logout,
    login,
  };
};
