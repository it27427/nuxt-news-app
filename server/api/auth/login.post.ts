// server/api/auth/login.ts

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';
import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // Multi-field validation
  const fields: Record<string, string> = {};
  if (!email) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';

  if (Object.keys(fields).length > 0) {
    throwError(400, 'Validation failed', fields);
  }

  // Find user
  const user = await db.select().from(users).where(eq(users.email, email));
  if (user.length === 0) {
    throwError(401, 'Invalid credentials', {
      email: 'Invalid email or password',
    });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) {
    throwError(401, 'Invalid credentials', {
      password: 'Invalid email or password',
    });
  }

  // Create JWT
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ id: user[0].id, email: user[0].email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);

  return { success: true, token };
});
