// server/api/tags/index.get.ts

import { desc } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  try {
    const allTags = await db.select().from(tags).orderBy(desc(tags.created_at));
    return { success: true, data: allTags };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to fetch tags' };
  }
});
