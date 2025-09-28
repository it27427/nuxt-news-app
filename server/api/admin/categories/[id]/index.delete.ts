// server/api/admin/categories/[id]/index.delete.ts

import { eq } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  // ⚠️ CRITICAL: Ensure only Super Admins can delete categories
  ensureSuperAdmin(event);

  try {
    const { id } = event.context.params as { id: string };

    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    if (existingCategory.length === 0) {
      throwError(404, 'Category not found', { id: 'Category not found' });
    }

    await db.delete(categories).where(eq(categories.id, id));

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  } catch (err: any) {
    // Ensure error format is consistent
    if (err.statusMessage && err.statusCode) throw err;
    return {
      success: false,
      message: err.message || 'Failed to delete category',
    };
  }
});
