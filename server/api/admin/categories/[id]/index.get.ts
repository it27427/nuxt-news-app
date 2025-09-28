// server/api/admin/categories/[id]/index.get.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';

/**
 * Fetches a single category by ID for editing in the Admin area.
 * Restricted to Super Admin only.
 */
export default defineEventHandler(async (event: H3Event) => {
  // 1. Authorization Check: Must be Super Admin
  // Assuming ensureSuperAdmin is available and throws an error if unauthorized
  ensureSuperAdmin(event);

  try {
    const categoryId = getRouterParam(event, 'id');

    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Category ID is missing.',
      });
    }

    // Fetch the category by ID
    const categoryData = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    const category = categoryData[0];

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found.',
      });
    }

    // Success Response
    return {
      success: true,
      category: category,
    };
  } catch (err: any) {
    // Re-throw H3 errors (including auth/404 errors)
    if (err.statusCode) throw err;
    console.error('Error fetching category:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch category.',
    });
  }
});
