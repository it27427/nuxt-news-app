// server/api/admin/news/index.get.ts

import { desc, eq, sql } from 'drizzle-orm';
import { H3Event, createError, getQuery } from 'h3';
import { db } from '~~/server/db/db';
import { news, users } from '~~/server/db/schema';

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
    if (authUser.role === 'super_admin') {
      // --- Super Admin Workflow ---

      // Function to map showEditDelete according to rules
      const mapNews = (item: any) => {
        let showEditDelete = false;
        switch (item.approval_status) {
          case 'reviewing':
          case 'approved':
          case 'pending':
            showEditDelete = true; // Super Admin can edit/delete
            break;
          case 'rejected':
            showEditDelete = true; // Super Admin can delete only
            break;
        }
        return {
          ...item,
          showEditDelete,
          badge: item.status === 'published' ? 'Published' : item.status,
        };
      };

      // --- Fetch Super Admin's own news ---
      const superAdminNews = await db
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

      const superAdminCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(news)
        .where(eq(news.user_id, authUser.id));
      const superAdminTotal = superAdminCountResult[0]?.count || 0;

      // --- Fetch Admin & Reporter news with join to get role ---
      const fetchRoleNews = async (role: 'admin' | 'reporter') => {
        const items = await db
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
          .innerJoin(users, eq(users.id, news.user_id))
          .where(eq(users.role, role))
          .orderBy(desc(news.created_at))
          .limit(limit)
          .offset(offset);

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(news)
          .innerJoin(users, eq(users.id, news.user_id))
          .where(eq(users.role, role));

        return {
          items: items.map(mapNews),
          total: countResult[0]?.count || 0,
        };
      };

      const adminNews = await fetchRoleNews('admin');
      const reporterNews = await fetchRoleNews('reporter');

      return {
        message: 'News fetched for Super Admin',
        data: {
          superAdminNews: {
            items: superAdminNews.map(mapNews),
            total: superAdminTotal,
          },
          adminNews,
          reporterNews,
        },
      };
    } else {
      // --- Reporter/Admin Workflow: Only own news ---
      const allNews = await db
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

      const reviewing = allNews
        .filter((n) => n.approval_status === 'reviewing')
        .map((n) => ({ ...n, showEditDelete: true }));
      const approved = allNews
        .filter((n) => n.approval_status === 'approved')
        .map((n) => ({ ...n, showEditDelete: true }));
      const pending = allNews
        .filter((n) => n.approval_status === 'pending')
        .map((n) => ({ ...n, showEditDelete: false })); // No action
      const rejected = allNews
        .filter((n) => n.approval_status === 'rejected')
        .map((n) => ({ ...n, showEditDelete: false })); // No action

      return {
        message: 'News fetched for Reporter/Admin',
        data: { reviewing, pending, approved, rejected },
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
