// server/api/admin/approval/list.get.ts

import { desc } from 'drizzle-orm';
import { H3Event, createError } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';

export default defineEventHandler(async (event: H3Event) => {
  ensureSuperAdmin(event);

  try {
    const allNews = await db
      .select({
        id: news.id,
        tiptap_json_for_editing: news.tiptap_json_for_editing,
        username: news.username,
        user_id: news.user_id,
        categories: news.categories,
        tags: news.tags,
        status: news.status,
        approval_status: news.approval_status,
        created_at: news.created_at,
      })
      .from(news)
      .orderBy(desc(news.created_at));

    const reviewing = allNews.filter((n) => n.approval_status === 'reviewing');
    const pending = allNews.filter((n) => n.approval_status === 'pending');
    const approved = allNews.filter((n) => n.approval_status === 'approved');
    const rejected = allNews.filter((n) => n.approval_status === 'rejected');

    return {
      success: true,
      data: {
        reviewing,
        pending,
        approved,
        rejected,
      },
    };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch approval list',
    });
  }
});
