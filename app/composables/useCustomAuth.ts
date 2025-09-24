import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { UserType } from '~~/types/admin';

const user = ref<UserType | null>(null);
const loading = ref(true);

export const useCustomAuth = () => {
  const router = useRouter();

  const initializeUser = () => {
    if (import.meta.client) {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
          const parsedUser: UserType = JSON.parse(storedUser);

          if (parsedUser && parsedUser.role) {
            user.value = parsedUser;
          } else {
            console.error(
              'User data is incomplete. Missing role. Redirecting to login.'
            );
            localStorage.removeItem('user');
            router.push('/auth/login');
          }
        } catch (e) {
          console.error('Failed to parse user data from localStorage.', e);
          localStorage.removeItem('user');
        }
      }
    }

    loading.value = false;
  };

  const logout = () => {
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    router.push('/auth/login');
  };

  return { logout, user, initializeUser, loading };
};
