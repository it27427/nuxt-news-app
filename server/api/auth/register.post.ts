// server/api/auth/register.ts

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  // Multi-field validation
  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';

  if (Object.keys(errors).length > 0) {
    throwError(400, 'Validation failed', errors);
  }

  // Check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length > 0) {
    throwError(400, 'User already exists with this email', {
      email: 'Already exists',
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true, message: 'User registered successfully' };
});
