import { useRouter } from 'vue-router';
import { ref } from 'vue';

// Use a simple ref for the user state, not Nuxt's useState
const user = ref(null);
const loading = ref(true);

export const useCustomAuth = () => {
  const router = useRouter();

  // Function to initialize the user from localStorage
  const initializeUser = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
    }
    loading.value = false;
  };

  const login = async (userData: { email: string }) => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user list from API');
      }
      const userList = await response.json();

      const fetchedUser = userList.find((u: any) => u.email === userData.email);

      if (fetchedUser) {
        user.value = {
          name: fetchedUser.name,
          email: fetchedUser.email,
          role: fetchedUser.role,
        };
        // Save user data to localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user.value));
        }
        router.push('/admin/dashboard');
      } else {
        console.error('User not found in the database.');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      router.push('/auth/login');
    }
  };

  const logout = () => {
    user.value = null;
    if (process.client) {
      localStorage.removeItem('user');
    }
    router.push('/auth/login');
  };

  return { logout, user, login, initializeUser, loading };
};
