// server/api/admin/news/[id]/index.put.ts

import { eq } from 'drizzle-orm';
import { H3Event, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { InsertApproval, SelectNews } from '~~/server/db/models';
import { approvals, news } from '~~/server/db/schema';
import { parseQuillDelta } from '~~/server/utils/parseQuillDelta';
import { DeltaOp, ParsedContent } from '~~/types/newstypes';

// --- Incoming Request Body Type (Request Body Structure) ---

/**
 * Defines the request body structure for updating a news article.
 * All fields are optional except for the auth context.
 */
export interface UpdateNewsBody {
  // Auth Context (usually injected by middleware, but kept here for type safety)
  userId: string;
  userRole: 'admin' | 'super_admin' | 'reporter';

  // Updatable Content
  quill_data_for_editing?: { ops: DeltaOp[] };
  categories?: string[];
  tags?: string[];
}

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Get Article ID from URL and Read Body
  const articleId = getRouterParam(event, 'id');
  const body: UpdateNewsBody = await readBody(event);
  const { userId, userRole, quill_data_for_editing, categories, tags } = body;

  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Article ID is missing.',
    });
  }
  if (!userId || !userRole) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication data is missing.',
    });
  }

  // Check for administrative access (reporter is allowed to update their own articles)
  if (
    userRole !== 'admin' &&
    userRole !== 'super_admin' &&
    userRole !== 'reporter'
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Access restricted to content creators.',
    });
  }

  try {
    // 2. Fetch the current article to verify ownership and existence
    const existingArticles = await db
      .select()
      .from(news)
      .where(eq(news.id, articleId))
      .limit(1);
    const existingArticle = existingArticles[0];

    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: `Not Found: Article with ID ${articleId} not found.`,
      });
    }

    // Authorization Check: Admins/Reporters can only update their own articles.
    if (userRole !== 'super_admin' && existingArticle.user_id !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage:
          'Forbidden: You can only update articles you have created.',
      });
    }

    // 3. Prepare Update Payloads and Status Logic
    const newsUpdatePayload: Partial<SelectNews> = {};
    let approvalAction = 'updated_draft';
    let approvalComment = `Article updated by ${userRole}.`;

    // Parse Quill Content if provided
    if (quill_data_for_editing) {
      let parsedContent: ParsedContent;
      try {
        parsedContent = parseQuillDelta(quill_data_for_editing.ops);
      } catch (error) {
        console.error('Quill Parsing Error:', error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Content parsing failed during update.',
        });
      }

      // Update core content fields
      newsUpdatePayload.title = parsedContent.title;
      newsUpdatePayload.subtitle = parsedContent.subtitle;
      newsUpdatePayload.homepage_excerpt = parsedContent.homepage_excerpt;
      newsUpdatePayload.full_content = parsedContent.full_content;
      newsUpdatePayload.images = parsedContent.images;
      newsUpdatePayload.videos = parsedContent.videos;
      newsUpdatePayload.quill_data_for_editing = quill_data_for_editing as any; // Type cast for JSONB

      // Status Logic: If the article was previously published or approved,
      // and a non-super admin updates the content, revert status to 'pending'.
      if (
        userRole !== 'super_admin' &&
        existingArticle.approval_status === 'approved'
      ) {
        newsUpdatePayload.approval_status = 'pending';
        newsUpdatePayload.status = 'draft'; // Revert status until re-approved

        approvalAction = 'reverted_to_pending';
        approvalComment =
          'Major content update, reverted to pending for re-approval.';
      } else if (existingArticle.approval_status === 'pending') {
        // If already pending, keep it pending, just log the update.
        approvalAction = 'updated_pending_article';
        approvalComment = 'Content updated while article was pending review.';
      }
    }

    // Update non-content fields (categories, tags)
    if (categories) newsUpdatePayload.categories = categories;
    if (tags) newsUpdatePayload.tags = tags;

    // 4. Construct Approval Log Payload
    const approvalPayload: InsertApproval = {
      news_id: articleId,
      acted_by: userId,
      action: approvalAction,
      comment: approvalComment,
    };

    // 5. Database Transaction
    await db.transaction(async (tx) => {
      // A. Update the main news article
      await tx
        .update(news)
        .set({ ...newsUpdatePayload, updated_at: new Date() }) // Include updated_at timestamp
        .where(eq(news.id, articleId));

      // B. Log the update action
      await tx.insert(approvals).values(approvalPayload);
    });

    // 6. Success Response
    return {
      message: 'News article updated successfully.',
      articleId: articleId,
      status: newsUpdatePayload.status || existingArticle.status,
      approvalStatus:
        newsUpdatePayload.approval_status || existingArticle.approval_status,
    };
  } catch (error) {
    console.error('Database Update Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to update article.',
    });
  }
});
