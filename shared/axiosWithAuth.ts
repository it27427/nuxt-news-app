// shared/axiosWithAuth.ts

import axios from 'axios';
import { useAuthStore } from '~~/store/auth.store';

export const axiosWithAuth = () => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (!token) throw new Error('Unauthorized: No token provided');
  return axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
};
