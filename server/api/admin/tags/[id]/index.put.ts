// server/api/admin/tags/[id]/index.put.ts

import { and, eq, ne } from 'drizzle-orm';
import { db } from '~~/server/db/db';
import { tags } from '~~/server/db/schema';
import { throwError } from '~~/server/utils/error';

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params as { id: string };
    const body = await readBody(event);
    const { name } = body;

    // Validation
    if (!name || !name.trim()) {
      throwError(400, 'Tag name is required', { name: 'Tag name is required' });
    }

    // Check if tag exists
    const existingTag = await db.select().from(tags).where(eq(tags.id, id));
    if (existingTag.length === 0) {
      throwError(404, 'Tag not found', { id: 'Tag not found' });
    }

    // Check for duplicate name (excluding current tag)
    const duplicate = await db
      .select()
      .from(tags)
      .where(and(eq(tags.name, name.trim()), ne(tags.id, id)));
    if (duplicate.length > 0) {
      throwError(400, 'Tag already exists', { name: 'Tag already exists' });
    }

    // Update tag
    const updated = await db
      .update(tags)
      .set({ name: name.trim() })
      .where(eq(tags.id, id))
      .returning();

    return {
      success: true,
      message: 'Tag updated successfully',
      tag: updated[0],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to update tag',
    };
  }
});
