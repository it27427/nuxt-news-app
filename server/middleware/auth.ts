import { defineEventHandler, getRequestHeader, createError } from 'h3';
import * as jose from 'jose';

// JWT_SECRET এনভায়রনমেন্ট ভেরিয়েবলটি সার্ভারে নিরাপদে ব্যবহার করা হচ্ছে।
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default defineEventHandler(async (event) => {
  // শুধুমাত্র সুরক্ষিত API routes-গুলোতে প্রমাণীকরণ চেক করা হচ্ছে।
  // পেজ রুট যেমন '/admin' এখন আর চেক করা হবে না।
  if (
    event.node.req.url?.startsWith('/api/protected') ||
    event.node.req.url?.startsWith('/api/admin')
  ) {
    try {
      // ক্লায়েন্টের পাঠানো টোকেনটি Authorization হেডার থেকে নেওয়া হচ্ছে।
      const token = getRequestHeader(event, 'authorization')?.split(' ')[1];

      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No token provided.',
        });
      }

      // টোকেনটি সার্ভারে যাচাই করা হচ্ছে।
      await jose.jwtVerify(token, secret);
    } catch (e) {
      // যদি যাচাই ব্যর্থ হয়, তাহলে একটি 401 Unauthorized ত্রুটি ফেরত দেওয়া হচ্ছে।
      console.error('Authentication failed:', e);
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token.',
      });
    }
  }
});
