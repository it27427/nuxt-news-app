// server/middleware/auth-admin.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const { status, data: sessionData } = useAuth();

  // loading
  if (status.value === 'loading') return;

  // not authenticated
  if (status.value !== 'authenticated') {
    return navigateTo('/admin/login');
  }

  const isAdmin = sessionData.value?.user?.admin;
  if (!isAdmin) return navigateTo('/admin/login');
});
