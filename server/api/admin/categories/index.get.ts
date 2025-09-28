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

    // 💡 DEBUG: Log the full list of categories being returned by the API.
    // This will help diagnose if a category name is hiding in the database due to spaces or case differences.

    allCategories.forEach((c) =>
      console.log(`ID: ${c.id}, Name (Length ${c.name.length}): [${c.name}]`)
    );

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
