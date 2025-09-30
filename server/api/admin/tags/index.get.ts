// server/api/tags/index.get.ts

import { desc } from 'drizzle-orm';
import { createError } from 'h3';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  try {
    // Fetch all tags ordered by creation date (newest first)
    const allTags = await db.select().from(tags).orderBy(desc(tags.created_at));

    // It is generally okay to return an empty array for a list endpoint,
    // so we return the data even if it's empty.
    return {
      success: true,
      data: allTags,
    };
  } catch (err: any) {
    console.error('Error fetching tags list:', err);
    // Return consistent error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tags list due to server error.',
      data: { error: err.message },
    });
  }
});
