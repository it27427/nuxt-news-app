// server/api/admin/approval/[id]/index.post.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError } from 'h3';
import { db } from '~~/server/db/db';
import { approvals, news, notifications } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth'; // Super Admin check

/**
 * Handles Super Admin action: Approve or Reject a news article.
 * Triggers status change, logs approval, and sends notification to the author.
 */
export default defineEventHandler(async (event: H3Event) => {
  // ⚠️ CRITICAL: Only Super Admins can approve or reject articles
  const superAdminUser = ensureSuperAdmin(event);

  const { id: newsId } = event.context.params as { id: string };
  const body = await readBody(event);
  const {
    newApprovalStatus, // 'approved' or 'rejected'
    comment = null,
  } = body;

  // Validation
  if (!['approved', 'rejected'].includes(newApprovalStatus)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid approval status provided.',
    });
  }

  try {
    // 1. Fetch the original news article to get the author's ID
    const originalNews = await db
      .select()
      .from(news)
      .where(eq(news.id, newsId));
    if (originalNews.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News article not found.',
      });
    }

    const article = originalNews[0];

    // Determine final statuses based on action
    let finalStatus: 'draft' | 'published';
    let actionLog: string;
    let notificationMessage: string;

    if (newApprovalStatus === 'approved') {
      // Approved: Set final status to published
      finalStatus = 'published';
      actionLog = 'approved';
      notificationMessage = `অভিনন্দন! আপনার নিউজ "${article.title}" Super Admin কর্তৃক **অনুমোদিত ও প্রকাশিত** হয়েছে।`;
    } else {
      // Rejected: Revert main status to draft and set approval status to rejected
      finalStatus = 'draft';
      actionLog = 'rejected';
      notificationMessage = `দুঃখিত। আপনার নিউজ "${article.title}" Super Admin কর্তৃক **বাতিল** করা হয়েছে।`;
    }

    // 2. Update the news article status
    await db
      .update(news)
      .set({
        status: finalStatus,
        approval_status: newApprovalStatus,
        updated_at: new Date(),
      })
      .where(eq(news.id, newsId));

    // 3. Log the approval action
    await db.insert(approvals).values({
      news_id: newsId,
      acted_by: superAdminUser.id,
      action: actionLog,
      comment:
        comment ||
        (newApprovalStatus === 'approved'
          ? 'Approved for publication.'
          : 'Article requires further editing.'),
    });

    // 4. Send notification to the original author (reporter/admin)
    await db.insert(notifications).values({
      recipient_user_id: article.user_id, // Original author
      news_id: newsId,
      message: notificationMessage,
    });

    return {
      success: true,
      message:
        newApprovalStatus === 'approved'
          ? 'Article published successfully.'
          : 'Article rejected and sent back to author.',
      newsId: newsId,
      newStatus: finalStatus,
    };
  } catch (error: any) {
    console.error('Error during approval action:', error);
    if (error.statusMessage) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process approval action.',
    });
  }
});
