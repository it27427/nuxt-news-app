// server/api/categories/index.post.ts

import { eq, sql } from 'drizzle-orm';
import { H3Event, createError, readBody } from 'h3';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';

/**
 * Creates a new category.
 * Restricted to Super Admin only. (POST /api/admin/categories)
 */
export default defineEventHandler(async (event: H3Event) => {
  // CRITICAL: Ensure only Super Admins can create categories
  ensureSuperAdmin(event);

  const body = await readBody(event);
  const name = body.name ? String(body.name).trim() : ''; // Ensure name is a trimmed string

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
    // 2. Check for duplicate name (Case-insensitive check)
    // Use lower() and sql to perform a case-insensitive check for duplication
    const duplicate = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(sql`lower(${categories.name})`, name.toLowerCase()))
      .limit(1);

    if (duplicate.length > 0) {
      throw createError({
        statusCode: 409, // Use 409 Conflict for resource conflict
        statusMessage: 'Validation Failed: Category already exists',
        data: { name: 'A category with this name already exists' },
      });
    }

    // 3. Insert new category
    const result = await db
      .insert(categories)
      .values({ name: name })
      .returning();

    // 4. Success Response
    return {
      success: true,
      message: 'Category created successfully',
      category: result[0],
    };
  } catch (err: any) {
    // Re-throw H3 errors (e.g., from validation, 409, or ensureSuperAdmin)
    if (err.statusCode) throw err;

    console.error('Database Insertion Error:', err);
    // Throw a generic 500 for unhandled internal errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to create category.',
    });
  }
});
