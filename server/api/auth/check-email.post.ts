import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody } from 'h3';
import { db } from '~/server/db/db';
import { users } from '~/server/db/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  // Regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check DB
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (!existingUser || existingUser.length === 0) {
    return {
      valid: false,
      error: 'User not found! Please register first then try again.',
    };
  }

  return { valid: true };
});
