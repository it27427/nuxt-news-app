import { createError, defineEventHandler, getRequestHeader } from 'h3';
import * as jose from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default defineEventHandler(async (event) => {
  if (
    event.node.req.url?.startsWith('/api/protected') ||
    event.node.req.url?.startsWith('/api/admin')
  ) {
    try {
      const token = getRequestHeader(event, 'authorization')?.split(' ')[1];

      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized: No token provided.',
        });
      }

      await jose.jwtVerify(token, secret);
    } catch (e) {
      console.error('Authentication failed:', e);
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token.',
      });
    }
  }
});
