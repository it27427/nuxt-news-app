// server/api/admin/users/[id]/update.post.ts

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };
  const body = await readBody(event);
  const { name, email, password, role } = body;

  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user.length) throwError(404, 'User not found');

  if (user[0].email === process.env.SUPER_ADMIN_EMAIL) {
    throwError(403, 'Default SUPER_ADMIN cannot be edited');
  }

  const updateData: Record<string, any> = {
    name: name || user[0].name,
    email: email || user[0].email,
    role: role || user[0].role,
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await db.update(users).set(updateData).where(eq(users.id, id));

  return { success: true, message: 'User updated successfully' };
});
