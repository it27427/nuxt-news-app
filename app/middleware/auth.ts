// /app/middleware/auth.ts

import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import * as jose from 'jose';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = localStorage.getItem('token');

  // Not logged in
  if (!token) {
    if (to.path.startsWith('/auth')) return;
    return navigateTo('/auth/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token, secret);

    // Logged in
    if (to.path.startsWith('/auth')) return navigateTo('/admin/dashboard');
  } catch {
    localStorage.removeItem('token');
    if (!to.path.startsWith('/auth')) return navigateTo('/auth/login');
  }
});
