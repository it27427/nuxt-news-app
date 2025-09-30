// app/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { routePermissions } from '~~/server/utils/permissions';
import { useAuthStore } from '~~/store/auth.store';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (import.meta.client) {
    const { isAuthenticated, user } = authStore;
    const isAuthPage = to.path.startsWith('/auth');
    const isProtected = !isAuthPage;

    if (isProtected && !isAuthenticated) {
      return navigateTo('/auth/login');
    }

    if (isAuthPage && isAuthenticated) {
      return navigateTo('/admin/dashboard');
    }

    // 🔒 Role-based check
    const allowedRoles = routePermissions[to.path];
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return navigateTo('/admin/dashboard');
    }
  }
});
