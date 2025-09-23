// server/scripts/resetUsers.ts

import { sql } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';

export default async function resetUsers() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL!;

  // SUPER_ADMIN ছাড়া সব ইউজার ডিলিট
  await db.delete(users).where(sql`${users.email} != ${superAdminEmail}`);

  console.log(
    `✅ All users except default ${superAdminEmail} have been deleted`
  );
}

if (require.main === module) {
  resetUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
