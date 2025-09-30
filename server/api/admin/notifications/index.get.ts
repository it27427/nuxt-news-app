// server/api/admin/notifications/index.get.ts

import { and, desc, eq, inArray } from 'drizzle-orm';
import { H3Event, createError, getQuery } from 'h3';
import { db } from '~~/server/db/db';
import { notifications } from '~~/server/db/schema';

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

export default defineEventHandler(async (event: H3Event) => {
  const authUser = event.context.user as AuthUser | undefined;

  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication required for this endpoint.',
    });
  }

  const userId = authUser.id;
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const offset = parseInt(query.offset as string) || 0;
  const readFilter = query.read as string | undefined; // 'true' or 'false'

  try {
    const conditions: any[] = [eq(notifications.recipient_user_id, userId)];

    if (readFilter === 'false') {
      conditions.push(eq(notifications.read, false));
    }

    // Role-based notification filtering
    if (authUser.role === 'super_admin') {
      // Super Admin sees only 'general' notifications
      conditions.push(eq(notifications.type, 'general'));
    } else {
      // Admin / Reporter see only status-based notifications
      conditions.push(
        inArray(notifications.type, ['pending', 'approved', 'rejected'])
      );
    }

    const results = await db
      .select()
      .from(notifications)
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(notifications.created_at));

    return {
      success: true,
      message: 'Notifications fetched successfully',
      data: results,
    };
  } catch (err) {
    console.error('Notifications DB error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch notifications.',
    });
  }
});
