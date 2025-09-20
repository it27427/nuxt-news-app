import { users } from '../db/schema';
import { db } from '../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await db.insert(users).values({
    name: body.name,
    email: body.email,
    password: body.password,
  });
  return { success: true };
});
