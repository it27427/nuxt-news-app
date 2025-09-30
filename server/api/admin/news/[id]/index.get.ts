// server/api/admin/news/[id]/index.get.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';
import { TiptapNode } from '~~/types/newstypes';

interface AuthUser {
  id: string;
  role: 'reporter' | 'admin' | 'super_admin';
}

// Define SelectNews type with strict Tiptap typing
export interface SelectNews {
  id: string;
  user_id: string;
  username: string;
  status: string;
  approval_status: string;
  categories: string[];
  tags: string[];
  tiptap_json_for_editing: {
    type: 'doc';
    content: TiptapNode[];
  };
  homepage_excerpt: TiptapNode[];
  full_content: TiptapNode[];
  images?: Array<{ img_src: string; caption: string; credit: string }>;
  videos?: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;
  created_at: Date;
  updated_at: Date;
}

export default defineEventHandler(async (event: H3Event) => {
  // 1. Get Article ID from URL
  const articleId = getRouterParam(event, 'id');
  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Article ID is missing.',
    });
  }

  // 2. Auth Check
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication data is missing.',
    });
  }

  try {
    // 3. Fetch the Article
    const existingArticles = await db
      .select({
        id: news.id,
        user_id: news.user_id,
        username: news.username,
        status: news.status,
        approval_status: news.approval_status,
        categories: news.categories,
        tags: news.tags,
        tiptap_json_for_editing: news.tiptap_json_for_editing,
        homepage_excerpt: news.homepage_excerpt,
        full_content: news.full_content,
        images: news.images,
        videos: news.videos,
        created_at: news.created_at,
        updated_at: news.updated_at,
      })
      .from(news)
      .where(eq(news.id, articleId))
      .limit(1);

    const existingArticle = existingArticles[0] as SelectNews | undefined;

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
    console.error('Database Fetch Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Internal Server Error: Failed to fetch the news article data.',
    });
  }
});
