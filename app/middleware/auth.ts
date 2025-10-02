// app/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { routePermissions } from '~~/server/utils/permissions';
import { useAuthStore } from '~~/store/auth.store';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (import.meta.client) {
    const isAuthPage = to.path.startsWith('/auth');
    const isProtected = !isAuthPage;

    if (isProtected && !authStore.isAuthenticated) {
      return navigateTo('/auth/login');
    }

    if (isAuthPage && authStore.isAuthenticated) {
      return navigateTo('/admin/dashboard');
    }

    const allowedRoles = routePermissions[to.path];

    if (
      allowedRoles &&
      authStore.user &&
      !allowedRoles.includes(authStore.user.role)
    ) {
      return navigateTo('/admin/dashboard');
    }
  }
});
