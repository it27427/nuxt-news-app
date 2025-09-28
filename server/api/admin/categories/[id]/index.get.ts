// server/api/admin/categories/[id]/index.get.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureAuthenticated } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  // ⚠️ Check: Ensure user is logged in to read configuration/category
  ensureAuthenticated(event);

  try {
    const { id } = event.context.params as { id: string };

    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (category.length === 0) {
      throwError(404, 'Category not found', { id: 'Category not found' });
    }

    return {
      success: true,
      category: category[0],
    };
  } catch (err: any) {
    // Ensure error format is consistent
    if (err.statusMessage && err.statusCode) throw err;
    return {
      success: false,
      message: err.message || 'Failed to fetch category',
    };
  }
});
