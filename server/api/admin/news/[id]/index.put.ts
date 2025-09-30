// server/api/admin/news/[id]/index.put.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getRouterParam, readBody } from 'h3';
import { db } from '~~/server/db/db';
import { InsertNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';
import { parseTiptapJson } from '~~/server/utils/parseTiptapJson';
import { ParsedContent, TiptapNode } from '~~/types/newstypes';

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

export interface UpdateNewsBody {
  categories?: string[];
  tags?: string[];
  tiptap_json_for_editing?: TiptapNode;
}

export default defineEventHandler(async (event: H3Event) => {
  // --- 1️⃣ Get Article ID & Body ---
  const articleId = getRouterParam(event, 'id');
  if (!articleId)
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is missing.',
    });

  const body: UpdateNewsBody = await readBody(event);

  // --- 2️⃣ Auth ---
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const { id: userId, role: userRole } = authUser;

  // --- 3️⃣ Fetch existing article ---
  const existingArticles = await db
    .select()
    .from(news)
    .where(eq(news.id, articleId))
    .limit(1);
  const existingArticle = existingArticles[0];
  if (!existingArticle)
    throw createError({ statusCode: 404, statusMessage: 'Article not found.' });

  // --- 4️⃣ Authorization ---
  if (userRole !== 'super_admin' && existingArticle.user_id !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: You can only update your own articles.',
    });
  }

  // --- 5️⃣ Build update payload ---
  const updatePayload: Partial<InsertNews> = {
    updated_at: new Date() as any,
  };

  if (body.categories) updatePayload.categories = body.categories as any;
  if (body.tags) updatePayload.tags = body.tags as any;

  if (body.tiptap_json_for_editing) {
    const tiptap = body.tiptap_json_for_editing;

    if (
      !tiptap.type ||
      tiptap.type !== 'doc' ||
      !Array.isArray(tiptap.content) ||
      !tiptap.content.length
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Tiptap content.',
      });
    }

    let parsed: ParsedContent;
    try {
      parsed = parseTiptapJson(tiptap);
    } catch (err) {
      throw createError({
        statusCode: 400,
        statusMessage: (err as Error).message || 'Content parsing failed.',
      });
    }

    // --- Assign parsed content to DB fields ---
    updatePayload.homepage_excerpt = parsed.homepage_excerpt as any;
    updatePayload.full_content = parsed.full_content as any;
    updatePayload.images = parsed.images as any;
    updatePayload.videos = parsed.videos as any;
    updatePayload.tiptap_json_for_editing = tiptap as any;

    // --- Determine status based on role ---
    if (userRole === 'super_admin') {
      updatePayload.status = 'published' as any;
      updatePayload.approval_status = 'approved' as any;
    } else {
      updatePayload.status = 'submitted' as any;
      updatePayload.approval_status = 'reviewing' as any;
    }
  }

  // --- 6️⃣ Execute update ---
  try {
    const updatedArticles = await db
      .update(news)
      .set(updatePayload)
      .where(eq(news.id, articleId))
      .returning();
    const updatedArticle = updatedArticles[0];
    if (!updatedArticle) throw new Error('Failed to retrieve updated article.');

    return {
      message: 'News article updated successfully.',
      data: updatedArticle,
    };
  } catch (err) {
    console.error('Database Update Error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update the news article.',
    });
  }
});
