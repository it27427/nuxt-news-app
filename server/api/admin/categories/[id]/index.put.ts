import { and, eq, ne, sql } from 'drizzle-orm';
import { H3Event, createError, getRouterParam, readBody } from 'h3';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';

/**
 * Updates an existing category by ID.
 * Restricted to Super Admin only.
 */
export default defineEventHandler(async (event: H3Event) => {
  // CRITICAL: Ensure only Super Admins can update categories
  ensureSuperAdmin(event);

  const categoryId = getRouterParam(event, 'id');
  const body = await readBody(event);
  // Ensure name is a trimmed string, defaulting to empty if missing
  const name = body.name ? String(body.name).trim() : '';

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Category ID is missing.',
    });
  }

  // 1. Validation: Category name is required
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Failed',
      // Return errors object for client-side field validation handling
      data: { name: 'Category name is required' },
    });
  }

  try {
    // 2. Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
      });
    }

    // 3. Check for duplicate name (excluding current category)
    // Use lower() and sql to perform a case-insensitive check for duplication
    const duplicate = await db
      .select({ id: categories.id }) // Select only the ID for efficiency
      .from(categories)
      .where(
        and(
          eq(sql`lower(${categories.name})`, name.toLowerCase()),
          ne(categories.id, categoryId) // Exclude the category being updated
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      throw createError({
        statusCode: 409, // Use 409 Conflict for resource conflict
        statusMessage: 'Validation Failed: Category already exists',
        data: { name: 'A category with this name already exists' },
      });
    }

    // 4. Update category
    const updated = await db
      .update(categories)
      // FIX: TS2353 - Casting to 'any' is necessary because 'updated_at' might be missing
      // in the inferred Drizzle update type, but is needed for the database operation.
      .set({ name: name, updated_at: new Date() } as any)
      .where(eq(categories.id, categoryId))
      .returning();

    // 5. Success Response
    return {
      success: true,
      message: 'Category updated successfully',
      category: updated[0],
    };
  } catch (err: any) {
    // Re-throw H3 errors (e.g., from validation, 409, 404, or ensureSuperAdmin)
    if (err.statusCode) throw err;

    console.error('Error updating category:', err);
    // Throw a generic 500 for unhandled internal errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category due to a server error.',
    });
  }
});
