// server/api/admin/approval/index.get.ts

import { desc, eq } from 'drizzle-orm';
import { H3Event, createError, getQuery } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';

/**
 * Fetches news articles based on their approval_status for the Super Admin panel.
 * Query Parameter: status (pending, approved, rejected, published)
 */
export default defineEventHandler(async (event: H3Event) => {
  // ⚠️ CRITICAL: Ensure only Super Admins can access the approval panel lists
  ensureSuperAdmin(event);

  try {
    const query = getQuery(event);
    const requestedStatus = query.status as string;

    if (
      !['pending', 'approved', 'rejected', 'published'].includes(
        requestedStatus
      )
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Invalid status requested. Must be pending, approved, rejected, or published.',
      });
    }

    let condition;

    // 'published' status is filtered by the main 'status' field.
    if (requestedStatus === 'published') {
      condition = eq(news.status, 'published');
    } else {
      // Filter by the approval workflow status for pending, approved, or rejected
      condition = eq(news.approval_status, requestedStatus);
    }

    // 💡 The .select() without arguments fetches ALL columns, including tiptap_json_for_editing.
    const newsList = await db
      .select()
      .from(news)
      .where(condition)
      .orderBy(desc(news.created_at));

    return {
      success: true,
      data: newsList,
    };
  } catch (error: any) {
    console.error('Error fetching approval news list:', error);
    // Pass through H3 errors or return generic 500
    if (error.statusMessage) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch news list for approval panel.',
    });
  }
});
