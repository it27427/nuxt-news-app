import { users } from '../db/schema';
import { db } from '../utils/db';

export default defineEventHandler(async (event) => {
  const allUsers = await db.select().from(users);
  return allUsers;
});
