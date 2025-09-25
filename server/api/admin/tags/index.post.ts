// server/api/tags/index.post.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name } = body;

  // Validation
  const fields: Record<string, string> = {};
  if (!name || !name.trim()) fields.name = 'Tag name is required';
  if (Object.keys(fields).length > 0)
    throwError(400, 'Validation failed', fields);

  // Check duplicate
  const existing = await db
    .select()
    .from(tags)
    .where(eq(tags.name, name.trim()));
  if (existing.length > 0) {
    throwError(400, 'Tag already exists', { name: 'Tag already exists' });
  }

  // Insert
  const result = await db
    .insert(tags)
    .values({ name: name.trim() })
    .returning();

  return {
    success: true,
    message: 'Tag created successfully',
    tag: result[0],
  };
});
