// server/api/admin/news/index.get.ts
import { desc, eq, sql } from 'drizzle-orm';
import { H3Event, createError, getQuery } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';

interface AuthUser {
  id: string;
  role: 'reporter' | 'admin' | 'super_admin';
}

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const offset = parseInt(query.offset as string) || 0;

  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  try {
    // --- Role-based filtering: Super Admin sees all, others see only their news ---
    let allNews;
    let totalCountResult;

    if (authUser.role === 'super_admin') {
      allNews = await db
        .select({
          id: news.id,
          user_id: news.user_id,
          username: news.username,
          status: news.status,
          approval_status: news.approval_status,
          categories: news.categories,
          tags: news.tags,
          tiptap_json_for_editing: news.tiptap_json_for_editing,
          created_at: news.created_at,
          updated_at: news.updated_at,
        })
        .from(news)
        .orderBy(desc(news.created_at))
        .limit(limit)
        .offset(offset);

      totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(news);
    } else {
      allNews = await db
        .select({
          id: news.id,
          user_id: news.user_id,
          username: news.username,
          status: news.status,
          approval_status: news.approval_status,
          categories: news.categories,
          tags: news.tags,
          tiptap_json_for_editing: news.tiptap_json_for_editing,
          created_at: news.created_at,
          updated_at: news.updated_at,
        })
        .from(news)
        .where(eq(news.user_id, authUser.id))
        .orderBy(desc(news.created_at))
        .limit(limit)
        .offset(offset);

      totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(news)
        .where(eq(news.user_id, authUser.id));
    }

    const totalCount = totalCountResult[0]?.count || 0;

    // --- Role-based structure for frontend ---
    if (authUser.role === 'super_admin') {
      return {
        message: 'News fetched for Super Admin',
        data: allNews.map((n) => ({
          ...n,
          showEditDelete: true,
          badge: n.status === 'published' ? 'Published' : n.status,
        })),
        totalCount,
      };
    } else {
      const reviewing = allNews
        .filter((n) => n.approval_status === 'reviewing')
        .map((n) => ({ ...n, showEditDelete: true }));
      const approved = allNews
        .filter((n) => n.approval_status === 'approved')
        .map((n) => ({ ...n, showEditDelete: true }));
      const pending = allNews
        .filter((n) => n.approval_status === 'pending')
        .map((n) => ({ ...n, showEditDelete: false }));
      const rejected = allNews
        .filter((n) => n.approval_status === 'rejected')
        .map((n) => ({ ...n, showEditDelete: false }));

      return {
        message: 'News fetched for Reporter/Admin',
        data: { reviewing, pending, approved, rejected },
        totalCount,
      };
    }
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch news',
    });
  }
});
