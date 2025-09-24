import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~~/store/auth';

export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();

  // storeToRefs ব্যবহার করে reactive properties destructure করা হচ্ছে
  const { user, loading, isAuthenticated } = storeToRefs(store);

  // Pinia স্টোর থেকে সরাসরি অ্যাকশন কল করা হচ্ছে
  const logout = () => {
    store.logout();
    router.push('/auth/login');
  };

  const initializeUser = store.initialize;

  return {
    user,
    loading,
    isAuthenticated,
    initializeUser,
    logout,
  };
};
