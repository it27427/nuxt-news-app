// server/api/admin/news/[id]/index.put.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getRouterParam, readBody } from 'h3';
import {
  determineStatus,
  validateAndParseTiptap,
} from '~~/server/api/admin/news/utils';
import { db } from '~~/server/db/db';
import { InsertNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';
import { TiptapNode } from '~~/types/newstypes';

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

export interface UpdateNewsBody {
  categories?: string[];
  tags?: string[];
  tiptap_json_for_editing?: {
    type: 'doc';
    content: TiptapNode[];
  };
}

export default defineEventHandler(async (event: H3Event) => {
  const articleId = getRouterParam(event, 'id');
  if (!articleId)
    throw createError({ statusCode: 400, statusMessage: 'Article ID missing' });

  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const body: UpdateNewsBody = await readBody(event);
  const { id: userId, role: userRole } = authUser;

  // Fetch existing article
  const existingArticle = (
    await db.select().from(news).where(eq(news.id, articleId)).limit(1)
  )[0];
  if (!existingArticle)
    throw createError({ statusCode: 404, statusMessage: 'Article not found' });

  // Permission check
  if (userRole !== 'super_admin' && existingArticle.user_id !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cannot update others articles',
    });
  }

  // Prepare update payload
  const updatePayload: Partial<InsertNews> = { updated_at: new Date() };

  if (body.categories) updatePayload.categories = body.categories;
  if (body.tags) updatePayload.tags = body.tags;

  if (body.tiptap_json_for_editing) {
    const parsedContent = validateAndParseTiptap(body.tiptap_json_for_editing);
    const { status, approval_status } = determineStatus(userRole);

    updatePayload.homepage_excerpt = parsedContent.homepage_excerpt;
    updatePayload.full_content = parsedContent.full_content;
    updatePayload.images = parsedContent.images;
    updatePayload.videos = parsedContent.videos;
    updatePayload.tiptap_json_for_editing = body.tiptap_json_for_editing;
    updatePayload.status = status;
    updatePayload.approval_status = approval_status;
  }

  try {
    const updated = (
      await db
        .update(news)
        .set(updatePayload)
        .where(eq(news.id, articleId))
        .returning()
    )[0];

    return { message: 'News updated successfully', data: updated };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update article',
    });
  }
});
