// server/api/auth/register.post.ts
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  // Multi-field validation
  const fields: Record<string, string> = {};
  if (!name) fields.name = 'Name is required';
  if (!email) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';

  if (Object.keys(fields).length > 0) {
    throwError(400, 'Validation failed', fields);
  }

  // Check if user already exists
  let existing = [];
  try {
    existing = await db.select().from(users).where(eq(users.email, email));
  } catch (err) {
    console.error('Database query failed:', err);
    throwError(500, 'Database connection error');
  }

  if (existing.length > 0) {
    throwError(400, 'User already exists', {
      email: 'Email already registered',
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
