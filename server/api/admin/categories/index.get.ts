import { desc } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureAuthenticated } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // NOTE: Removed ensureAuthenticated(event) to make category list publicly readable.
  // If you need authentication, restore the line above.
  ensureAuthenticated(event);

  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.created_at));

    return { success: true, data: allCategories };
  } catch (err: any) {
    // Ensure error format is consistent
    if (err.statusMessage && err.statusCode) throw err;
    return {
      success: false,
      message: err.message || 'Failed to fetch categories',
    };
  }
});
