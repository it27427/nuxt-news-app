// server/api/admin/news/index.post.ts

import { H3Event, createError } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { db } from '~~/server/db/db';
import { InsertApproval, InsertNews } from '~~/server/db/models';
import { approvals, news } from '~~/server/db/schema';
// 💡 UPDATED: Import the new Tiptap parser
import { parseTiptapJson } from '~~/server/utils/parseTiptapJson';
// 💡 UPDATED: Import Tiptap Node type from the new types file
import { ParsedContent, TiptapNode } from '~~/types/newstypes';

// --- Incoming Request Body Type ---

/**
 * Defines the expected request body structure for creating a news article.
 */
export interface CreateNewsBody {
  categories: string[];
  tags: string[];
  // 💡 UPDATED: Expect ProseMirror JSON for editing
  tiptap_json_for_editing: TiptapNode;
  userId: string;
  username: string;
  userRole: 'admin' | 'super_admin' | 'reporter';
}

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Read Request Body
  const body: CreateNewsBody = await readBody(event);
  const {
    userId,
    username,
    userRole,
    // 💡 UPDATED: Destructure the new field name
    tiptap_json_for_editing,
    categories,
    tags,
  } = body;

  // --- Basic Authorization & Validation Checks ---

  if (!userId || !username) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: User authentication data is missing.',
    });
  }

  // NOTE: Assuming only 'admin' and 'super_admin' can publish/create articles
  if (userRole === 'reporter') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only administrators can create news articles.',
    });
  }

  // Ensure tiptap data is present (must be a doc type with content)
  if (
    !tiptap_json_for_editing ||
    tiptap_json_for_editing.type !== 'doc' ||
    !tiptap_json_for_editing.content ||
    tiptap_json_for_editing.content.length === 0
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Tiptap content data is required.',
    });
  }

  // 2. Parse the Tiptap JSON
  let parsedContent: ParsedContent;
  try {
    // 💡 UPDATED: Use the new Tiptap parser
    parsedContent = parseTiptapJson(tiptap_json_for_editing);
  } catch (error) {
    console.error('Tiptap Parsing Error:', error);
    throw createError({
      statusCode: 400, // Changed to 400 as it's a content structure error
      statusMessage: (error as Error).message || 'Content parsing failed.',
    });
  }

  // Final check for the required Title extracted from content
  if (!parsedContent.title) {
    // This check is now also inside parseTiptapJson, but kept as a failsafe
    throw createError({
      statusCode: 400,
      statusMessage:
        'Bad Request: Article title is required. Ensure the first element is a Heading Level 1.',
    });
  }

  // 3. Determine Article Status based on User Role
  let status: 'draft' | 'published' = 'draft';
  let approvalStatus: 'draft' | 'pending' | 'approved' = 'draft';
  let approvalAction: string = 'saved_draft';
  const newArticleId = uuidv4();

  if (userRole === 'super_admin') {
    // Super Admins publish directly
    status = 'published';
    approvalStatus = 'approved';
    approvalAction = 'published_direct';
  } else {
    // Regular Admins send it for review (pending)
    approvalStatus = 'pending';
    approvalAction = 'sent_for_review';
  }

  // 4. Construct News Payload
  const newsPayload: InsertNews = {
    id: newArticleId,
    user_id: userId,
    username: username,
    status: status,
    approval_status: approvalStatus,
    categories: categories,
    tags: tags,
    title: parsedContent.title,
    subtitle: parsedContent.subtitle,
    homepage_excerpt: parsedContent.homepage_excerpt,
    full_content: parsedContent.full_content,
    images: parsedContent.images,
    videos: parsedContent.videos,
    // 💡 UPDATED: Store the raw Tiptap JSON object
    tiptap_json_for_editing: tiptap_json_for_editing as any,
  };

  // 5. Construct Approval Log Payload
  const approvalPayload: InsertApproval = {
    news_id: newArticleId,
    acted_by: userId,
    action: approvalAction,
    comment:
      userRole === 'super_admin'
        ? 'Published directly by Super Admin.'
        : 'Article sent for approval.',
  };

  // 6. Database Transaction
  try {
    await db.transaction(async (tx) => {
      // A. Insert the main news article
      await tx.insert(news).values(newsPayload);

      // B. Log the initial action
      await tx.insert(approvals).values(approvalPayload);
    });

    // 7. Success Response
    return {
      message: 'News article created successfully.',
      articleId: newArticleId,
      status: status,
      approvalStatus: approvalStatus,
    };
  } catch (error) {
    console.error('Database Insertion Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Internal Server Error: Failed to save article to database.',
    });
  }
});
