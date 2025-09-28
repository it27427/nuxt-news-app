// server/api/admin/tags/[id]/index.delete.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  // ⚠️ CRITICAL: Ensure only Super Admins can delete tags
  ensureSuperAdmin(event);

  try {
    const { id } = event.context.params as { id: string };

    const existingTag = await db.select().from(tags).where(eq(tags.id, id));
    if (existingTag.length === 0) {
      throwError(404, 'Tag not found', { id: 'Tag not found' });
    }

    await db.delete(tags).where(eq(tags.id, id));

    return {
      success: true,
      message: 'Tag deleted successfully',
    };
  } catch (err: any) {
    // Ensure error format is consistent
    if (err.statusMessage && err.statusCode) throw err;
    return {
      success: false,
      message: err.message || 'Failed to delete tag',
    };
  }
});
