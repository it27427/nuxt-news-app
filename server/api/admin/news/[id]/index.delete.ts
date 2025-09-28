// server/api/admin/news/[id]/index.delete.ts

import { eq } from 'drizzle-orm';
import { H3Event, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { approvals, news } from '~~/server/db/schema'; // approvals table is needed for cascade delete logic

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

  // Check for administrative access
  if (
    userRole !== 'admin' &&
    userRole !== 'super_admin' &&
    userRole !== 'reporter'
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Access restricted to content creators.',
    });
  }

  try {
    // 3. Fetch the current article to verify ownership and existence
    const existingArticles = await db
      .select({
        user_id: news.user_id,
      })
      .from(news)
      .where(eq(news.id, articleId))
      .limit(1);
    const existingArticle = existingArticles[0];

    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: `Not Found: Article with ID ${articleId} not found.`,
      });
    }

    // Authorization Check: Admins/Reporters can only delete their own articles.
    if (userRole !== 'super_admin' && existingArticle.user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage:
          'Forbidden: You can only delete articles you have created.',
      });
    }

    // 4. Database Transaction for Deletion
    await db.transaction(async (tx) => {
      // A. Delete associated approval logs first
      // Note: If you have configured ON DELETE CASCADE in your DB schema for approvals,
      // this step (A) might be optional, but executing it explicitly ensures data integrity.
      await tx.delete(approvals).where(eq(approvals.news_id, articleId));

      // B. Delete the main news article
      const result = await tx.delete(news).where(eq(news.id, articleId));

      // Optional: Check if a row was actually deleted (drizzle might not return affected rows easily)
      // For simplicity, we rely on the earlier existence check.
    });

    // 5. Success Response
    return {
      message: 'News article deleted successfully.',
      articleId: articleId,
    };
  } catch (error) {
    // Re-throw H3 errors
    const h3Error = error as any;
    if (h3Error.statusCode) {
      throw error;
    }
    console.error('Database Deletion Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Internal Server Error: Failed to delete the news article.',
    });
  }
});
