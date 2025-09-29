// server/api/admin/news/[id]/index.get.ts

import { eq } from 'drizzle-orm';
import { H3Event, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { SelectNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';

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
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication data is missing.',
    });
  }

  try {
    // 3. Fetch the Article
    const existingArticles: SelectNews[] = await db
      .select()
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

    // 4. Success Response
    return {
      message: 'News article fetched successfully.',
      data: existingArticle,
    };
  } catch (error) {
    // Re-throw H3 errors
    const h3Error = error as any;
    if (h3Error.statusCode) {
      throw error;
    }
    console.error('Database Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Internal Server Error: Failed to fetch the news article data.',
    });
  }
});
