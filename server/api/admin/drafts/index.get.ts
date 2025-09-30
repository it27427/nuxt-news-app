// server/api/admin/drafts/index.get.ts

import { and, desc, eq, inArray } from 'drizzle-orm';
import { createError, getQuery, H3Event } from 'h3';
import { db } from '~~/server/db/db';
import type { SelectNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';

// --- Auth Context Type ---
interface AuthUser {
  id: string;
  role: 'super_admin' | 'admin' | 'reporter';
}

export default defineEventHandler(async (event: H3Event) => {
  // --- Auth Check ---
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Please log in to view drafts.',
    });
  }

  const userId = authUser.id;
  const userRole = authUser.role;

  // --- Pagination Parameters ---
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const offset = parseInt(query.offset as string) || 0;

  try {
    const allowedStatuses: SelectNews['status'][] = ['draft', 'pending'];

    // --- Build conditions ---
    const conditions = [];

    // Status filter for everyone
    conditions.push(inArray(news.status, allowedStatuses));

    // Role-based filter
    if (userRole !== 'super_admin') {
      // admin & reporter: only their own drafts
      conditions.push(eq(news.user_id, userId));
    }
    // super_admin sees all drafts (no user_id filter)

    // --- Fetch from DB ---
    const articles = await db
      .select()
      .from(news)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(news.created_at));

    return articles;
  } catch (error) {
    console.error('Database Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch drafts.',
    });
  }
});
