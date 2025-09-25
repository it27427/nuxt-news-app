// server/api/admin/tags/[id]/index.get.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params as { id: string };

    const tag = await db.select().from(tags).where(eq(tags.id, id));

    if (tag.length === 0) {
      throwError(404, 'Tag not found', { id: 'Tag not found' });
    }

    return {
      success: true,
      tag: tag[0],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to fetch tag',
    };
  }
});
