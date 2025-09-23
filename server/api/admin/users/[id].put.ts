// server/api/admin/users/[id].put.ts

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../../../../server/db/db';
import { users } from '../../../../server/db/schema';
import { throwError } from '../../../../server/utils/error';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };
  const body = await readBody(event);
  const { name, email, password, role } = body;

  const fields: Record<string, string> = {};
  if (!name) fields.name = 'Name is required';
  if (!email) fields.email = 'Email is required';
  if (!role) fields.role = 'Role is required';
  if (Object.keys(fields).length > 0)
    throwError(400, 'Validation failed', fields);

  // Prevent updating default SUPER_ADMIN
  if (email === process.env.SUPER_ADMIN_EMAIL) {
    throwError(403, 'Default SUPER_ADMIN cannot be modified');
  }

  const updateData: Record<string, any> = { name, email, role };
  if (password && password.trim() !== '') {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updated = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id));

  return { success: true, message: 'User updated successfully', updated };
});
