// server/api/admin/news/index.get.ts

import { desc, sql } from 'drizzle-orm';
import { H3Event, getQuery } from 'h3';
import { db } from '~~/server/db/db';
import { SelectNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Get query parameters
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const offset = parseInt(query.offset as string) || 0;

  // 2. Mock Authentication (MUST BE REPLACED BY REAL AUTH LOGIC)
  // Assuming successful authentication allows access to the list
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication data is missing.',
    });
  }

  try {
    // 3. Fetch News List
    // 💡 FIX: We must select ALL properties defined in SelectNews to satisfy the TypeScript compiler.
    // images and videos fields are now included.
    const allNews: SelectNews[] = await db
      .select({
        id: news.id,
        user_id: news.user_id,
        username: news.username,
        status: news.status,
        approval_status: news.approval_status,
        categories: news.categories,
        tags: news.tags,
        title: news.title,
        subtitle: news.subtitle,
        homepage_excerpt: news.homepage_excerpt,
        full_content: news.full_content,

        // 💡 ADDED: Including images and videos to match SelectNews type
        images: news.images,
        videos: news.videos,

        // 💡 UPDATED: Select the new Tiptap JSON field name
        tiptap_json_for_editing: news.tiptap_json_for_editing,

        created_at: news.created_at,
        updated_at: news.updated_at,
      })
      .from(news)
      .orderBy(desc(news.created_at))
      .limit(limit)
      .offset(offset);

    // 4. Fetch Total Count (simplified)
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(news);
    const totalCount = totalCountResult[0]?.count || 0;

    // 5. Success Response
    return {
      message: 'News list fetched successfully.',
      data: allNews,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error('Database Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch the news list.',
    });
  }
});
