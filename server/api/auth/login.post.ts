import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = 'Email is required';
  }
  if (!password) {
    errors.password = 'Password is required';
  }
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = 'Invalid email format';
    return { success: false, errors };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (!existingUser || existingUser.length === 0) {
    errors.email = 'User not found! Please register first then try again.';
    return { success: false, errors };
  }

  const user = existingUser[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    errors.password =
      'Incorrect password. Please provide the correct password.';
    return { success: false, errors };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );

  return {
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
});
