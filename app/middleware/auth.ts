// /app/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  // শুধুমাত্র ক্লায়েন্ট-সাইডে টোকেন যাচাই করা হচ্ছে।
  if (process.client) {
    const token = localStorage.getItem('token');

    // লগইন করা নেই।
    if (!token) {
      if (to.path.startsWith('/auth')) return;
      return navigateTo('/auth/login');
    }

    // যদি লগইন করা থাকে, তাহলে লগইন পেজে গেলে তাকে ড্যাশবোর্ডে পাঠানো হচ্ছে।
    if (to.path.startsWith('/auth')) {
      return navigateTo('/admin/dashboard');
    }
  }
});
