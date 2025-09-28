// server/api/admin/notifications/index.get.ts

import { and, desc, eq } from 'drizzle-orm'; // 'and' function imported (Fixed Error 2304)
import { H3Event, createError, getQuery } from 'h3';
import { db } from '~~/server/db/db';

// NOTE: The following types and schema imports are placeholders.
// You must replace these with your actual Drizzle schema imports (e.g., from '~~/server/db/schema').

// --- Mock Schema Placeholders ---
interface SelectNotification {
  id: string;
  user_id: string; // The user who receives the notification
  related_article_id?: string;
  message: string;
  is_read: boolean;
  type: 'system' | 'approval' | 'status_change';
  created_at: Date;
}

// Assumed Drizzle schema definition (Placeholder)
const notifications = {
  id: 'notifications_id',
  user_id: 'notifications_user_id',
  created_at: 'notifications_created_at',
  is_read: 'notifications_is_read', // 'is_read' field added for filtering
} as const;

// --- Auth Context Type ---

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Mock Authentication (MUST BE REPLACED BY REAL AUTH LOGIC)
  const authUser = event.context.user as AuthUser | undefined;

  // Check if user is authenticated (all roles need access to their own notifications).
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication required for this endpoint.',
    });
  }

  const userId = authUser.id;

  // 2. Read Query Parameters for Pagination
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20; // Default limit 20
  const offset = parseInt(query.offset as string) || 0;
  const readFilter = query.read as string | undefined; // 'true' or 'false'

  try {
    // 3. Build the WHERE clause dynamically
    const conditions: any[] = []; // Using 'any' due to mock schema structure

    // ENFORCE FILTERING: Every user only sees notifications targeted to their ID.
    // Fix: Mock object properties are cast to 'any' to resolve TypeScript errors (Fixed Error 2769)
    conditions.push(eq(notifications.user_id as any, userId));

    // Optional: Filter by read status
    if (readFilter === 'false') {
      // Filter for unread notifications (assuming is_read field exists and is boolean)
      conditions.push(eq(notifications.is_read as any, false as any));
    }

    // 4. Query the database
    // NOTE: Since the full Drizzle schema is not available, we use generic select()
    const articles = await db
      .select()
      .from(notifications as any) // Type assertion due to mock structure
      // Use 'and' to combine multiple conditions
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(notifications.created_at as any)); // Order by newest first

    // 5. Return the results
    return articles as SelectNotification[];
  } catch (error) {
    console.error('Database Fetch Error:', error);
    // Throw an H3 error for client
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to fetch notifications.',
    });
  }
});
