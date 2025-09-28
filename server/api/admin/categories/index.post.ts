// server/api/categories/index.post.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  // ⚠️ CRITICAL: ensureSuperAdmin is now configured to check ONLY for 'super_admin' role.
  ensureSuperAdmin(event);

  const body = await readBody(event);
  const { name } = body;

  // Validation
  const fields: Record<string, string> = {};
  if (!name || !name.trim()) fields.name = 'Category name is required';
  if (Object.keys(fields).length > 0)
    throwError(400, 'Validation failed', fields);

  // Check duplicate
  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.name, name.trim()));
  if (existing.length > 0) {
    throwError(400, 'Category already exists', {
      name: 'Category already exists',
    });
  }

  // Insert
  const result = await db
    .insert(categories)
    .values({ name: name.trim() })
    .returning();

  return {
    success: true,
    message: 'Category created successfully',
    category: result[0],
  };
});
