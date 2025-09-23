// server/api/admin/users.get.ts

import { db } from '../../../db/db';
import { users } from '../../../db/schema';

export default defineEventHandler(async () => {
  const userList = await db.select().from(users);
  return userList.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
    isDefaultSuperAdmin: u.email === process.env.SUPER_ADMIN_EMAIL,
  }));
});
