// server/utils/seedSuperAdmin.ts

import bcrypt from 'bcryptjs';
import { db } from '../db/db';
import { users } from '../db/schema';

export default defineNitroPlugin(async () => {
  const allUsers = await db.select().from(users);

  if (allUsers.length === 0) {
    const hashed = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD!, 10);

    await db.insert(users).values({
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL!,
      password: hashed,
      role: 'super_admin',
    });

    console.log('✅ Default Super Admin created from .env');
  }
});
