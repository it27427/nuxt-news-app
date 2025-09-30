// server/api/admin/drafts/[id]/index.patch.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, readBody } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';
import { parseTiptapJson } from '~~/server/utils/parseTiptapJson';
import { TiptapNode } from '~~/types/newstypes';

interface AuthUser {
  id: string;
  role: 'super_admin' | 'admin' | 'reporter';
}

export default defineEventHandler(async (event: H3Event) => {
  const authUser = event.context.user as AuthUser | undefined;
  if (!authUser)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const { id: userId, role: userRole } = authUser;
  const draftId = event.context.params?.id as string;
  const body = await readBody(event);

  const { categories, tags, tiptap_json_for_editing } = body as {
    categories?: string[];
    tags?: string[];
    tiptap_json_for_editing?: TiptapNode;
  };

  if (tiptap_json_for_editing) {
    if (
      !tiptap_json_for_editing.content?.length ||
      tiptap_json_for_editing.type !== 'doc'
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Tiptap JSON',
      });
    }
  }

  try {
    // Draft ownership check
    const existing = await db
      .select()
      .from(news)
      .where(eq(news.id, draftId))
      .limit(1);
    if (!existing.length)
      throw createError({ statusCode: 404, statusMessage: 'Draft not found' });

    const draft = existing[0];

    if (userRole !== 'super_admin' && draft.user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Not allowed to edit this draft',
      });
    }

    let parsed = tiptap_json_for_editing
      ? parseTiptapJson(tiptap_json_for_editing)
      : null;

    await db
      .update(news)
      .set({
        ...(categories ? { categories } : {}),
        ...(tags ? { tags } : {}),
        ...(parsed
          ? {
              homepage_excerpt: parsed.homepage_excerpt,
              full_content: parsed.full_content,
              images: parsed.images,
              videos: parsed.videos,
              tiptap_json_for_editing: tiptap_json_for_editing as any,
            }
          : {}),
      })
      .where(eq(news.id, draftId));

    return { success: true, message: 'Draft updated successfully' };
  } catch (error) {
    console.error('Draft Update Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update draft',
    });
  }
});
