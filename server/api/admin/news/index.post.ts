// server/api/admin/news/index.post.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getHeader, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '~~/server/db/db';
import { InsertApproval, InsertNews } from '~~/server/db/models';
import { approvals, news, users } from '~~/server/db/schema';
import { parseTiptapJson } from '~~/server/utils/parseTiptapJson';
import { ParsedContent, TiptapNode } from '~~/types/newstypes';

export interface CreateNewsBody {
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
      statusMessage: 'Unauthorized: Invalid user data from token.',
    });
  }

  // --- Read Request Body ---
  const body: CreateNewsBody = await readBody(event);
  const { categories, tags, tiptap_json_for_editing } = body;

  // --- Fetch user from DB ---
  const userRecord = await db.select().from(users).where(eq(users.id, userId));
  const user = userRecord[0];

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: User not found.',
    });
  }

  const username: string = user.name;
  const userRole: 'admin' | 'super_admin' | 'reporter' = user.role as any;

  // --- Validate Tiptap content ---
  if (
    !tiptap_json_for_editing ||
    tiptap_json_for_editing.type !== 'doc' ||
    !tiptap_json_for_editing.content?.length
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Tiptap content is required.',
    });
  }

  let parsedContent: ParsedContent;
  try {
    parsedContent = parseTiptapJson(tiptap_json_for_editing);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: (err as Error).message || 'Content parsing failed.',
    });
  }

  if (!parsedContent.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Article title is required.',
    });
  }

  // --- Determine Article Status Based on Role ---
  let status: 'submitted' | 'published';
  let approvalStatus: 'reviewing' | 'approved';
  let approvalAction: string;
  const newArticleId = uuidv4();

  if (userRole === 'super_admin') {
    status = 'published';
    approvalStatus = 'approved';
    approvalAction = 'published_direct';
  } else {
    status = 'submitted';
    approvalStatus = 'reviewing';
    approvalAction = 'sent_for_review';
  }

  // --- Construct Payloads ---
  const newsPayload: InsertNews = {
    id: newArticleId,
    user_id: userId,
    username,
    status,
    approval_status: approvalStatus,
    categories,
    tags,
    homepage_excerpt: parsedContent.homepage_excerpt,
    full_content: parsedContent.full_content,
    images: parsedContent.images,
    videos: parsedContent.videos,
    tiptap_json_for_editing: tiptap_json_for_editing as any,
  };

  const approvalPayload: InsertApproval = {
    news_id: newArticleId,
    acted_by: userId,
    action: approvalAction,
    comment:
      userRole === 'super_admin'
        ? 'Published directly by Super Admin.'
        : 'Article sent for review.',
  };

  // --- Database Transaction ---
  try {
    await db.transaction(async (tx) => {
      await tx.insert(news).values(newsPayload);
      await tx.insert(approvals).values(approvalPayload);
    });

    return {
      message: 'News article created successfully.',
      articleId: newArticleId,
      status,
      approvalStatus,
    };
  } catch (err) {
    console.error('Database Insertion Error:', err);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Internal Server Error: Failed to save article to database.',
    });
  }
});
