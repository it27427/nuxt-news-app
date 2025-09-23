// server/api/admin/users/[id].get.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };

  const result = await db.select().from(users).where(eq(users.id, id));
  if (result.length === 0) throwError(404, 'User not found');

  return { user: result[0] };
});
