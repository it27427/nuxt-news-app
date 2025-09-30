// server/api/admin/approval/[id]/index.post.ts

import { eq } from 'drizzle-orm';
import { H3Event, createError, readBody } from 'h3';
import { db } from '~~/server/db/db';
import { approvals, news, notifications } from '~~/server/db/schema';
import { ensureSuperAdmin } from '~~/server/utils/auth';

interface ApprovalBody {
  newApprovalStatus: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

export default defineEventHandler(async (event: H3Event) => {
  const superAdminUser = ensureSuperAdmin(event);

  const { id: newsId } = event.context.params as { id: string };
  const body: ApprovalBody = await readBody(event);

  if (!['pending', 'approved', 'rejected'].includes(body.newApprovalStatus)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid approval status',
    });
  }

  const originalNews = (
    await db.select().from(news).where(eq(news.id, newsId))
  )[0];
  if (!originalNews)
    throw createError({ statusCode: 404, statusMessage: 'News not found' });

  let finalStatus: 'pending' | 'published' | 'rejected';
  let notificationMessage: string;

  switch (body.newApprovalStatus) {
    case 'pending':
      finalStatus = 'pending';
      notificationMessage = `⏳ "${originalNews.username}"⏱️আপনার নিউজ অনিষ্পাদিত অবস্থায় আছে।`;
      break;
    case 'approved':
      finalStatus = 'published';
      notificationMessage = `🎉 অভিনন্দন "${originalNews.username}"! ✅ আপনার নিউজ অনুমোদিত এবং প্রকাশিত হয়েছে।`;
      break;
    case 'rejected':
      finalStatus = 'rejected';
      notificationMessage = `😔 দুঃখিত "${originalNews.username}"। 🙁 আপনার নিউজ বাতিল করা হয়েছে।`;
      break;
  }

  try {
    await db.transaction(async (tx) => {
      // Update news
      await tx
        .update(news)
        .set({
          status: finalStatus,
          approval_status: body.newApprovalStatus,
          updated_at: new Date(),
        })
        .where(eq(news.id, newsId));

      // Log approval
      await tx.insert(approvals).values({
        news_id: newsId,
        acted_by: superAdminUser.id,
        action: body.newApprovalStatus,
        comment: body.comment || 'No comment',
        created_at: new Date(),
      });

      // Notify original author
      await tx.insert(notifications).values({
        recipient_user_id: originalNews.user_id,
        news_id: newsId,
        message: notificationMessage,
        read: false,
        created_at: new Date(),
      });
    });

    return {
      success: true,
      message: `News ${body.newApprovalStatus} successfully.`,
      newStatus: finalStatus,
      approvalStatus: body.newApprovalStatus,
    };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process approval action.',
    });
  }
});
