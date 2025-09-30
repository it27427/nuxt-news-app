// server/api/admin/drafts/index.post.ts
import { eq } from 'drizzle-orm';
import { H3Event, createError, getHeader, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '~~/server/db/db';
import { InsertNews } from '~~/server/db/models';
import { news, users } from '~~/server/db/schema';
import { parseTiptapJson } from '~~/server/utils/parseTiptapJson';
import { ParsedContent, TiptapNode } from '~~/types/newstypes';

export interface CreateDraftBody {
  categories: string[];
  tags: string[];
  tiptap_json_for_editing: TiptapNode;
}

export default defineEventHandler(async (event: H3Event) => {
  // --- JWT Validation ---
  const authHeader = getHeader(event, 'authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing token',
    });
  }

  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid token',
    });
  }

  const { id: userId, email } = decoded;
  if (!userId || !email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid user data',
    });
  }

  // --- Read Body ---
  const body: CreateDraftBody = await readBody(event);
  const { categories, tags, tiptap_json_for_editing } = body;

  if (
    !tiptap_json_for_editing?.content?.length ||
    tiptap_json_for_editing.type !== 'doc'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tiptap content is required',
    });
  }

  const parsedContent: ParsedContent = parseTiptapJson(tiptap_json_for_editing);

  if (!parsedContent.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Draft title is required',
    });
  }

  // --- Fetch User ---
  const userRecord = await db.select().from(users).where(eq(users.id, userId));
  const user = userRecord[0];
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' });
  }

  const username: string = user.name;

  const draftId = uuidv4();

  const draftPayload: InsertNews = {
    id: draftId,
    user_id: userId,
    username,
    status: 'draft',
    approval_status: 'draft',
    categories,
    tags,
    homepage_excerpt: parsedContent.homepage_excerpt,
    full_content: parsedContent.full_content,
    images: parsedContent.images,
    videos: parsedContent.videos,
    tiptap_json_for_editing: tiptap_json_for_editing as any,
  };

  try {
    await db.insert(news).values(draftPayload);

    return {
      message: 'Draft saved successfully.',
      draftId,
    };
  } catch (err) {
    console.error('Draft DB Error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save draft',
    });
  }
});
