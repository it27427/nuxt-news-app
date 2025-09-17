import { defineNuxtRouteMiddleware, navigateTo } from '#app';

// Example: user state (সাধারণত useAuthStore বা server session থেকে আসবে)
const fakeUser = {
  isLoggedIn: true,
  role: 'admin', // 'super_admin' | 'admin' | 'user'
};

export default defineNuxtRouteMiddleware((to) => {
  // যদি লগইন না থাকে
  if (!fakeUser.isLoggedIn) {
    return navigateTo('/admin/login');
  }

  // Super Admin only routes
  if (to.path.startsWith('/admin/users') && fakeUser.role !== 'super_admin') {
    return navigateTo('/admin/error');
  }

  if (to.path.startsWith('/admin/tags') && fakeUser.role !== 'super_admin') {
    return navigateTo('/admin/error');
  }

  // Admin + Super Admin allowed routes
  if (
    (to.path.startsWith('/admin/news') ||
      to.path.startsWith('/admin/drafts') ||
      to.path.startsWith('/admin/notifications') ||
      to.path.startsWith('/admin/approval') ||
      to.path.startsWith('/admin/dashboard') ||
      to.path.startsWith('/admin/automations')) &&
    !['super_admin', 'admin'].includes(fakeUser.role)
  ) {
    return navigateTo('/admin/error');
  }
});
