// server/api/tags/index.get.ts

import { desc } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

/**
 * Fetches all available tags from the database.
 * This API is restricted to Super Admin only.
 */
export default defineEventHandler(async (event) => {
  // CRITICAL: Ensure only Super Admins can read the tags list
  // The ensureAdmin function currently checks for the 'super_admin' role.
  ensureSuperAdmin(event);

  try {
    const allTags = await db.select().from(tags).orderBy(desc(tags.created_at));

    if (allTags.length === 0) {
      // If no tags exist, throw an error
      throwError(404, 'No tags found.');
    }

    return { success: true, data: allTags };
  } catch (err: any) {
    // If it's an H3Error thrown by throwError or ensureAdmin, re-throw it.
    if (err.statusCode) throw err;

    console.error('Error fetching tags list:', err);
    // Throw a generic 500 error for unexpected database failures
    throwError(500, 'Failed to fetch tags list.');
  }
});
