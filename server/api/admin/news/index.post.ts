// server/api/admin/news/index.post.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, getHeader, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '~~/server/db/db';
import { InsertApproval, InsertNews } from '~~/server/db/models';
import { approvals, news, users } from '~~/server/db/schema';
import { TiptapNode } from '~~/types/newstypes';
import { determineStatus, validateAndParseTiptap } from './utils';

export interface CreateNewsBody {
  categories: string[];
  tags: string[];
  tiptap_json_for_editing: TiptapNode;
}

export default defineEventHandler(async (event: H3Event) => {
  const authHeader = getHeader(event, 'authorization') || '';
  if (!authHeader.startsWith('Bearer '))
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }

  const { id: userId, email, role: userRole } = decoded;
  if (!userId || !email)
    throw createError({ statusCode: 401, statusMessage: 'Invalid user data' });

  const body: CreateNewsBody = await readBody(event);
  const { categories, tags, tiptap_json_for_editing } = body;

  const userRecord = await db.select().from(users).where(eq(users.id, userId));
  const user = userRecord[0];
  if (!user)
    throw createError({ statusCode: 401, statusMessage: 'User not found' });

  const parsedContent = validateAndParseTiptap(tiptap_json_for_editing);
  const { status, approval_status, action } = determineStatus(userRole);

  const newArticleId = uuidv4();

  const newsPayload: InsertNews = {
    id: newArticleId,
    user_id: userId,
    username: user.name,
    status,
    approval_status,
    categories,
    tags,
    homepage_excerpt: parsedContent.homepage_excerpt,
    full_content: parsedContent.full_content,
    images: parsedContent.images,
    videos: parsedContent.videos,
    tiptap_json_for_editing: tiptap_json_for_editing as any,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const approvalPayload: InsertApproval = {
    news_id: newArticleId,
    acted_by: userId,
    action,
    comment:
      userRole === 'super_admin' ? 'Published directly' : 'Sent for review',
    created_at: new Date(),
  };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(news).values(newsPayload);
      await tx.insert(approvals).values(approvalPayload);
    });

    return {
      message: 'News created successfully',
      articleId: newArticleId,
      status,
      approval_status,
    };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create article',
    });
  }
});
