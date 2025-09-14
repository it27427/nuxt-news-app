// app/middleware/auth-admin.ts

import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const { status, data: sessionData } = useAuth();

  if (status.value === 'loading') return;

  if (status.value !== 'authenticated' || !sessionData.value?.user?.admin) {
    return navigateTo('/admin/login', { replace: true });
  }
});
