// server/api/admin/drafts/[id]/index.get.ts

import { and, eq, inArray } from 'drizzle-orm';
import { createError, H3Event } from 'h3';
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

  // --- Get draft id from params ---
  const draftId = event.context.params?.id;
  if (!draftId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Draft ID is required.',
    });
  }

  try {
    const allowedStatuses: SelectNews['status'][] = ['draft', 'pending'];

    // --- Build conditions ---
    const conditions = [
      eq(news.id, draftId),
      inArray(news.status, allowedStatuses),
    ];

    // যদি super_admin না হয়, তবে শুধু নিজের draft দেখতে পারবে
    if (userRole !== 'super_admin') {
      conditions.push(eq(news.user_id, userId));
    }

    // --- Fetch from DB ---
    const draft = await db
      .select()
      .from(news)
      .where(and(...conditions))
      .limit(1);

    if (!draft || draft.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Draft not found or access denied.',
      });
    }

    return draft[0];
  } catch (error) {
    console.error('Database Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch draft.',
    });
  }
});
