// app/middleware/auth.ts;

import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import * as jose from 'jose';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = localStorage.getItem('token');

  // If there's no token, user is not logged in
  if (!token) {
    // If user is trying to access /auth routes, allow it
    if (to.path.startsWith('/auth')) return;
    // Otherwise redirect to login
    return navigateTo('/auth/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token, secret);

    // User is logged in
    if (to.path.startsWith('/auth')) {
      // If user tries to visit /auth while logged in, redirect to dashboard
      return navigateTo('/admin/dashboard');
    }

    // Otherwise, allow access to admin routes
    return;
  } catch {
    // Invalid token
    localStorage.removeItem('token');

    // If user tries to access /auth routes, allow it
    if (to.path.startsWith('/auth')) return;

    // Otherwise redirect to login
    return navigateTo('/auth/login');
  }
});
