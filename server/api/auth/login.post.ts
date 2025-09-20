import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';
import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // Validation
  const fields: Record<string, string> = {};
  if (!email) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';
  if (Object.keys(fields).length > 0) {
    throwError(400, 'Validation failed', fields);
  }

  // Find user
  const user = await db.select().from(users).where(eq(users.email, email));
  if (user.length === 0) {
    throwError(
      404,
      "This user doesn't exist. Please register first then try again.",
      {
        email: 'User not found! Please register first then try again.',
      }
    );
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) {
    throwError(
      401,
      'Password is incorrect, please provide the correct password.',
      {
        password: 'Password is incorrect, please provide the correct password.',
      }
    );
  }

  // Create JWT
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ id: user[0].id, email: user[0].email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);

  return { success: true, message: 'Login successful', token };
});
