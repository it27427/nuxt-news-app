// server/api/admin/tags/[id]/index.get.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';
// ⚠️ FIX: ensureSuperAdmin should be used for admin endpoints instead of generic ensureAuthenticated
import { ensureSuperAdmin } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

/**
 * Fetches a single tag by ID for editing in the Admin area.
 * This API is restricted to Super Admin only.
 */
export default defineEventHandler(async (event) => {
  // CRITICAL: Ensure only Super Admins can access single tag details for editing
  ensureSuperAdmin(event);

  try {
    // Correctly get and assert the type of the ID parameter
    const { id: tagId } = event.context.params as { id: string };

    // Fetch the tag by ID, ensuring tagId is used as a string in eq()
    const tagData = await db.select().from(tags).where(eq(tags.id, tagId));

    if (tagData.length === 0) {
      // Throw 404 if tag is not found
      throwError(404, 'Tag not found', { id: 'Tag not found' });
    }

    // ⚠️ FIX: Return the tag data using the 'tag' key instead of 'category'
    return {
      success: true,
      tag: tagData[0], // Return the first (and only) result
    };
  } catch (err: any) {
    // If it's an H3Error thrown by throwError or ensureSuperAdmin, re-throw it.
    if (err.statusCode) throw err;

    console.error('Error fetching tag:', err);
    // Return a consistent error response for internal issues
    return {
      success: false,
      message: err.message || 'Failed to fetch tag',
    };
  }
});
