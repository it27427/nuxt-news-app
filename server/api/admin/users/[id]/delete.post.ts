// server/api/admin/users/[id]/delete.post.ts

import { eq } from 'drizzle-orm';
import { db } from '../../../../db/db';
import { users } from '../../../../db/schema';
import { throwError } from '../../../../utils/error';

export default defineEventHandler(async (event) => {
  const params = event.context.params as { id: string };
  const id = params.id;

  if (!id) throwError(400, 'User ID is required');

  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user.length) throwError(404, 'User not found');

  if (user[0].email === process.env.SUPER_ADMIN_EMAIL) {
    throwError(403, 'Default SUPER_ADMIN cannot be deleted');
  }

  await db.delete(users).where(eq(users.id, id));

  return { success: true, message: 'User deleted successfully' };
});
