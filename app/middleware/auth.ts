import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import * as jose from 'jose';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = localStorage.getItem('token');
  if (!token) return navigateTo('/auth/login');

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token, secret);
  } catch {
    return navigateTo('/auth/login');
  }
});
