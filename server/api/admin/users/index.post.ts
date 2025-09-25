// server/api/admin/users/index.post.ts

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
  if (!role) fields.role = 'Role is required';

  if (Object.keys(fields).length > 0)
    throwError(400, 'Validation failed', fields);

  // Check existing user
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0)
    throwError(400, 'User already exists', {
      email: 'Email already registered',
    });

  // Prevent creating another default SUPER_ADMIN
  if (email === process.env.SUPER_ADMIN_EMAIL) {
    throwError(403, 'Cannot create another default SUPER_ADMIN');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: role || 'admin',
  });

  return { success: true, message: 'User created successfully' };
});
