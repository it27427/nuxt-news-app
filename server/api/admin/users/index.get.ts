// server/api/admin/index.get.ts
import jwt from 'jsonwebtoken';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  // ✅ Authorization header থেকে টোকেন বের করা
  const authHeader = getHeader(event, 'authorization') || '';
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No token provided',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid token format',
    });
  }

  const token = parts[1];
  try {
    // ✅ টোকেন ভেরিফাই করা
    jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Token verification failed',
    });
  }

  // ✅ ইউজার লিস্ট ফেচ করা
  const userList = await db.select().from(users);

  // ✅ শুধু দরকারি ডেটা রিটার্ন করা
  return userList.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
    isDefaultSuperAdmin: u.email === process.env.SUPER_ADMIN_EMAIL,
  }));
});
