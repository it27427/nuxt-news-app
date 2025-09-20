import { users } from '~~/server/db/schema';
import { db } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const allUsers = await db.select().from(users);
  return allUsers;
});
