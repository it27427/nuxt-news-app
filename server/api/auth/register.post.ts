// server/api/auth/register.post.ts
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../../../server/db/db';
import { users } from '../../../server/db/schema';
import { throwError } from '../../../server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  const fields: Record<string, string> = {};
  if (!name) fields.name = 'Name is required';
  if (!email) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';

  if (Object.keys(fields).length > 0) {
    throwError(400, 'Validation failed', fields);
  }

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

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true, message: 'User registered successfully' };
});
