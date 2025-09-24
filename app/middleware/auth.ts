// app/middleware/auth.ts

import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~~/store/auth.store';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  const isAuthPage = to.path.startsWith('/auth');
  const isProtected = !isAuthPage;

  if (isProtected && !isAuthenticated) {
    return navigateTo('/auth/login');
  }

  if (isAuthPage && isAuthenticated) {
    return navigateTo('/admin/dashboard');
  }
});
