// server/api/admin/categories/[id]/index.put.ts

import { and, eq, ne } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { categories } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  // ⚠️ CRITICAL: Ensure only Super Admins can update categories
  ensureSuperAdmin(event);

  try {
    const { id } = event.context.params as { id: string };
    const body = await readBody(event);
    const { name } = body;

    // Validation
    if (!name || !name.trim()) {
      throwError(400, 'Category name is required', {
        name: 'Category name is required',
      });
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    if (existingCategory.length === 0) {
      throwError(404, 'Category not found', { id: 'Category not found' });
    }

    // Check for duplicate name (excluding current category)
    const duplicate = await db
      .select()
      .from(categories)
      .where(and(eq(categories.name, name.trim()), ne(categories.id, id)));
    if (duplicate.length > 0) {
      throwError(400, 'Category already exists', {
        name: 'Category already exists',
      });
    }

    // Update category
    const updated = await db
      .update(categories)
      .set({ name: name.trim() })
      .where(eq(categories.id, id))
      .returning();

    return {
      success: true,
      message: 'Category updated successfully',
      category: updated[0],
    };
  } catch (err: any) {
    // Ensure error format is consistent
    if (err.statusMessage && err.statusCode) throw err;
    return {
      success: false,
      message: err.message || 'Failed to update category',
    };
  }
});
