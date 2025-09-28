// server/api/admin/news/index.post.ts

import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { db } from '~~/server/db/db';
import { InsertApproval, InsertNews } from '~~/server/db/models';
import { approvals, news } from '~~/server/db/schema';
import { parseQuillDelta } from '~~/server/utils/parseQuillDelta';
import { DeltaOp, ParsedContent } from '~~/types/newstypes';

// --- Incoming Request Body Type ---

/**
 * Defines the expected request body structure for creating a news article.
 * NOTE: This local definition is used to align with the destructuring variables
 * and resolve TypeScript errors previously encountered.
 */
export interface CreateNewsBody {
  categories: string[];
  tags: string[];
  quill_data_for_editing: { ops: DeltaOp[] };
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
    quill_data_for_editing,
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

  if (userRole === 'reporter') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only administrators can create news articles.',
    });
  }

  // Ensure quill data is present and has operations
  if (!quill_data_for_editing || quill_data_for_editing.ops.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Quill content data is required.',
    });
  }

  // 2. Parse the Quill Delta JSON
  let parsedContent: ParsedContent;
  try {
    // Pass only the 'ops' array to the parser function
    parsedContent = parseQuillDelta(quill_data_for_editing.ops);
  } catch (error) {
    console.error('Quill Parsing Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Content parsing failed.',
    });
  }

  // Final check for the required Title extracted from content
  if (!parsedContent.title) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Bad Request: Article title is required. Ensure the first line is formatted as the News Title.',
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
    // Store the raw Delta object for loading back into the editor later
    quill_data_for_editing: quill_data_for_editing as any,
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
