// app/middleware/admin-error.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  if (to.path.startsWith('/admin')) {
    const matched = to.matched.length > 0;
    if (!matched) {
      return navigateTo('/admin/error');
    }
  }
});
