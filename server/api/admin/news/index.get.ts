// server/api/admin/news/index.get.ts

import { and, desc, eq } from 'drizzle-orm';
import { SQL } from 'drizzle-orm/sql';
import { H3Event } from 'h3';
import { db } from '~~/server/db/db';
import { SelectNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Mock Authentication and Authorization (MUST BE REPLACED BY REAL AUTH LOGIC)
  // Assumes a server middleware has populated the authenticated user context.
  const authUser = event.context.user as
    | {
        id: string;
        role: 'admin' | 'super_admin' | 'reporter';
      }
    | undefined;

  // Check if user is authenticated.
  // If not authenticated, restrict access to this administrative endpoint.
  if (!authUser) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Authentication required for this endpoint.',
    });
  }

  const userId = authUser.id;
  const userRole = authUser.role;

  // The endpoint is restricted to show only PUBLISHED news based on previous request.
  const enforcedStatus: SelectNews['status'] = 'published';

  // 2. Read Query Parameters for Pagination
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20; // Default limit 20
  const offset = parseInt(query.offset as string) || 0;

  try {
    // 3. Build the WHERE clause dynamically
    const conditions: SQL[] = [];

    // ENFORCE STATUS: Filter for 'published' status for everyone
    conditions.push(eq(news.status, enforcedStatus));

    // ROLE-BASED FILTERING:
    // If the user is NOT a 'super_admin', they can only see their own published articles.
    if (userRole !== 'super_admin') {
      // This applies to both 'admin' and 'reporter' roles.
      conditions.push(eq(news.user_id, userId));
    }

    // Super Admins ('super_admin') see all published articles (no user_id filter applied).
    // 4. Query the database
    const articles = await db
      .select()
      .from(news)
      // Use 'and' to combine multiple conditions
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(news.created_at)); // Order by newest first

    // 5. Return the results
    return articles;
  } catch (error) {
    console.error('Database Fetch Error:', error);
    // Throw an H3 error for client
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch news articles.',
    });
  }
});
