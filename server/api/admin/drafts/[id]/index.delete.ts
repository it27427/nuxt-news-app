// server/api/admin/drafts/[id]/index.delete.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';

interface AuthUser {
  id: string;
  role: 'super_admin' | 'admin' | 'reporter';
}

export default defineEventHandler(async (event: H3Event) => {
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const { id: userId, role: userRole } = authUser;
  const draftId = event.context.params?.id as string;

  try {
    const existing = await db
      .select()
      .from(news)
      .where(eq(news.id, draftId))
      .limit(1);
    if (!existing.length)
      throw createError({ statusCode: 404, statusMessage: 'Draft not found' });

    const draft = existing[0];

    if (userRole !== 'super_admin' && draft.user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Not allowed to delete this draft',
      });
    }

    await db.delete(news).where(eq(news.id, draftId));

    return { success: true, message: 'Draft deleted successfully' };
  } catch (error) {
    console.error('Draft Delete Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete draft',
    });
  }
});
