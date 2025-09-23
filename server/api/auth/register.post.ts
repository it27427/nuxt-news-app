// server/api/auth/register.post.ts

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password, role } = body;

  const fields: Record<string, string> = {};
  if (!name) fields.name = 'Name is required';
  if (!email) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';
  if (Object.keys(fields).length > 0)
    throwError(400, 'Validation failed', fields);

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0)
    throwError(400, 'User already exists', {
      email: 'Email already registered',
    });

  const allUsers = await db.select().from(users);

  let assignedRole = role || 'admin';
  // প্রথম রেজিস্টার করা ইউজার SUPER_ADMIN হবে যদি ডিফল্ট SUPER_ADMIN already DB তে থাকে
  if (
    allUsers.length === 1 &&
    allUsers[0].email === process.env.SUPER_ADMIN_EMAIL
  ) {
    assignedRole = 'super_admin';
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: assignedRole,
  });

  return { success: true, message: 'User registered successfully' };
});
