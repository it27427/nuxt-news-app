// server/api/admin/news/[id]/index.get.ts

import { and, eq } from 'drizzle-orm';
import { H3Event, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';

// --- Auth Context Type ---

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Get Article ID from URL
  const articleId = getRouterParam(event, 'id');

  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Article ID is missing.',
    });
  }

  // 2. Mock Authentication (MUST BE REPLACED BY REAL AUTH LOGIC)
  const authUser = event.context.user as AuthUser | undefined;

  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication data is missing.',
    });
  }

  const { id: userId, role: userRole } = authUser;

  try {
    // 3. Build the WHERE clause for Authorization
    const conditions = [eq(news.id, articleId)];

    // Super Admins can fetch any article.
    // Other roles ('admin', 'reporter') can ONLY fetch articles they own.
    if (userRole !== 'super_admin') {
      // Non-super-admins must match the user_id
      conditions.push(eq(news.user_id, userId));
    }

    // 4. Query the database
    const articles = await db
      .select()
      .from(news)
      // Use 'and' to ensure both article ID and authorization checks pass
      .where(and(...conditions))
      .limit(1);

    const article = articles[0];

    // 5. Check Result and Return
    if (!article) {
      // If no article found, it's either 404 (doesn't exist) or 403 (exists but unauthorized)
      // For security, we usually default to 404 in the admin view.
      throw createError({
        statusCode: 404,
        statusMessage: `Not Found: Article with ID ${articleId} not found or access denied.`,
      });
    }

    return article;
  } catch (error) {
    // Re-throw H3 errors
    const h3Error = error as any;
    if (h3Error.statusCode) {
      throw error;
    }
    console.error('Database Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch the news article.',
    });
  }
});
