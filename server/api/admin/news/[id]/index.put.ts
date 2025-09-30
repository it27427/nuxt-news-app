// server/api/admin/news/[id]/index.put.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getRouterParam, readBody } from 'h3';
import { db } from '~~/server/db/db';
import { InsertNews } from '~~/server/db/models';
import { news } from '~~/server/db/schema';
import { TiptapNode } from '~~/types/newstypes';
import { determineStatus, validateAndParseTiptap } from '../utils';

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
  const articleId = getRouterParam(event, 'id');
  if (!articleId)
    throw createError({ statusCode: 400, statusMessage: 'Article ID missing' });

  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const body: UpdateNewsBody = await readBody(event);
  const { id: userId, role: userRole } = authUser;

  const existingArticle = (
    await db.select().from(news).where(eq(news.id, articleId)).limit(1)
  )[0];
  if (!existingArticle)
    throw createError({ statusCode: 404, statusMessage: 'Article not found' });
  if (userRole !== 'super_admin' && existingArticle.user_id !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cannot update others articles',
    });
  }

  const updatePayload: Partial<InsertNews> = { updated_at: new Date() as any };
  if (body.categories) updatePayload.categories = body.categories as any;
  if (body.tags) updatePayload.tags = body.tags as any;

  if (body.tiptap_json_for_editing) {
    const parsedContent = validateAndParseTiptap(body.tiptap_json_for_editing);
    const { status, approval_status } = determineStatus(userRole);

    updatePayload.homepage_excerpt = parsedContent.homepage_excerpt as any;
    updatePayload.full_content = parsedContent.full_content as any;
    updatePayload.images = parsedContent.images as any;
    updatePayload.videos = parsedContent.videos as any;
    updatePayload.tiptap_json_for_editing = body.tiptap_json_for_editing as any;
    updatePayload.status = status as any;
    updatePayload.approval_status = approval_status as any;
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
