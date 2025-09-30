// server/api/admin/drafts/index.get.ts

import { and, desc, eq } from 'drizzle-orm';
import { createError, getQuery, H3Event } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';

interface AuthUser {
  id: string;
  role: 'super_admin' | 'admin' | 'reporter';
}

export default defineEventHandler(async (event: H3Event) => {
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const { id: userId, role: userRole } = authUser;
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const offset = parseInt(query.offset as string) || 0;

  try {
    const conditions = [eq(news.status, 'draft')];

    if (userRole !== 'super_admin') {
      // শুধু নিজের ড্রাফট
      conditions.push(eq(news.user_id, userId));
    }

    const drafts = await db
      .select()
      .from(news)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(news.created_at));

    return { success: true, data: drafts };
  } catch (error) {
    console.error('Draft Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch drafts',
    });
  }
});
