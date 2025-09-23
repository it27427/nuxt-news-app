// server/scripts/seed.ts

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { users } from '~~/server/db/schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const pool = new Pool({
    connectionString: connectionString,
  });

  const db = drizzle(pool);

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

  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
