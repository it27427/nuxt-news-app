// server/api/admin/drafts/index.get.ts

import { and, desc, eq, inArray, SQL } from 'drizzle-orm';
import { createError, getQuery, H3Event } from 'h3';
import { db } from '~~/server/db/db';
import { SelectNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';

// --- Auth Context Type ---

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Mock Authentication (MUST BE REPLACED BY REAL AUTH LOGIC)
  const authUser = event.context.user as AuthUser | undefined;

  // Check if user is authenticated and has a content creation/admin role.
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication required for this endpoint.',
    });
  }

  const userId = authUser.id;
  const userRole = authUser.role;

  // This endpoint specifically fetches articles that are not yet published.
  // We assume 'draft' and 'pending' are the statuses for work-in-progress.
  const allowedStatuses: SelectNews['status'][] = ['draft', 'pending'];

  // 2. Read Query Parameters for Pagination
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20; // Default limit 20
  const offset = parseInt(query.offset as string) || 0;

  try {
    // 3. Build the WHERE clause dynamically
    const conditions: SQL[] = [];

    // ENFORCE STATUS: Filter for 'draft' or 'pending' status
    conditions.push(inArray(news.status, allowedStatuses));

    // ROLE-BASED FILTERING:
    // If the user is NOT a 'super_admin', they can only see their own drafts and pending articles.
    if (userRole !== 'super_admin') {
      conditions.push(eq(news.user_id, userId));
    }

    // 4. Query the database
    // 💡 The .select() without arguments fetches ALL columns, including tiptap_json_for_editing.
    const articles = await db
      .select()
      .from(news)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(news.created_at));

    // 5. Return the results
    return articles;
  } catch (error) {
    console.error('Database Fetch Error:', error);
    // Throw an H3 error for client
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch draft articles.',
    });
  }
});
