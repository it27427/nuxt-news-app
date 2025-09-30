// server/api/admin/news/[id]/index.delete.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { approvals, news } from '~~/server/db/schema';

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
    throw createError({ statusCode: 400, statusMessage: 'Article ID missing' });
  }

  // 2. Auth Check
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const { id: userId, role: userRole } = authUser;

  try {
    // 3. Fetch article to check existence and ownership
    const existingArticle = (
      await db
        .select({ user_id: news.user_id })
        .from(news)
        .where(eq(news.id, articleId))
        .limit(1)
    )[0];

    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found',
      });
    }

    // 4. Ownership Check (Admins/Reporters can delete only their own)
    if (userRole !== 'super_admin' && existingArticle.user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only delete your own articles.',
      });
    }

    // 5. Transaction: Delete approvals first, then news
    await db.transaction(async (tx) => {
      await tx.delete(approvals).where(eq(approvals.news_id, articleId));
      await tx.delete(news).where(eq(news.id, articleId));
    });

    // 6. Success Response
    return { message: 'News article deleted successfully.', articleId };
  } catch (error) {
    console.error('Database Deletion Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete the news article.',
    });
  }
});
