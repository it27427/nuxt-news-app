import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~~/store/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (import.meta.client) {
    if (!authStore.isAuthenticated) {
      if (to.path.startsWith('/auth')) return;
      return navigateTo('/auth/login');
    }

    if (to.path.startsWith('/auth')) {
      return navigateTo('/admin/dashboard');
    }
  }
});
