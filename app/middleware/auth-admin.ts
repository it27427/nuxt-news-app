import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '#imports';

export default defineNuxtRouteMiddleware(async (to: any) => {
  const { status, data: sessionData } = useAuth();

  if (status.value !== 'authenticated') {
    return navigateTo('/admin/login');
  }

  // Type-safe: user as any if needed, but better cast
  const isAdmin = (sessionData.value?.user as any)?.admin;

  if (!isAdmin) {
    return navigateTo('/');
  }
});
