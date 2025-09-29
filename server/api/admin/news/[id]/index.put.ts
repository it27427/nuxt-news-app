// server/api/admin/news/[id]/index.put.ts

import { eq } from 'drizzle-orm';
import { H3Event, getRouterParam } from 'h3';
import { db } from '~~/server/db/db';
import { news } from '~~/server/db/schema';
// 💡 UPDATED: Import the new Tiptap parser
import { parseTiptapJson } from '~~/server/utils/parseTiptapJson';
// 💡 UPDATED: Import Tiptap Node type from the new types file
import { SelectNews } from '~~/server/db/models';
import { ParsedContent, TiptapNode } from '~~/types/newstypes';

// --- Auth Context Type ---

interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

// --- Request Body Type ---

/**
 * Defines the expected request body structure for updating a news article.
 */
export interface UpdateNewsBody {
  categories?: string[];
  tags?: string[];
  // 💡 UPDATED: Expect ProseMirror JSON for editing (optional for partial update)
  tiptap_json_for_editing?: TiptapNode;
}

// --- API Handler ---

export default defineEventHandler(async (event: H3Event) => {
  // 1. Get Article ID and Request Body
  const articleId = getRouterParam(event, 'id');
  const body: UpdateNewsBody = await readBody(event);

  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Article ID is missing.',
    });
  }

  // 2. Mock Authentication (MUST BE REPLACED BY REAL AUTH LOGIC)
  const authUser = event.context.user as AuthUser | undefined;

  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication data is missing.',
    });
  }

  const { id: userId, role: userRole } = authUser;

  // Check for administrative access (reporter can also update their own article)
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

  // 3. Fetch the current article to verify ownership and existence
  const existingArticles: SelectNews[] = await db
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

  // 4. Determine Update Payload & Parse Content if Tiptap data is provided
  const updatePayload: Partial<SelectNews> = {
    updated_at: new Date(), // Set update time
  };

  if (body.categories) {
    updatePayload.categories = body.categories;
  }
  if (body.tags) {
    updatePayload.tags = body.tags;
  }

  // 💡 Tiptap Content Handling
  if (body.tiptap_json_for_editing) {
    // Basic validation
    if (
      body.tiptap_json_for_editing.type !== 'doc' ||
      !body.tiptap_json_for_editing.content ||
      body.tiptap_json_for_editing.content.length === 0
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Tiptap content data is invalid.',
      });
    }

    let parsedContent: ParsedContent;
    try {
      // 💡 UPDATED: Use the new Tiptap parser
      parsedContent = parseTiptapJson(body.tiptap_json_for_editing);
    } catch (error) {
      console.error('Tiptap Parsing Error:', error);
      throw createError({
        statusCode: 400,
        statusMessage: (error as Error).message || 'Content parsing failed.',
      });
    }

    // Update content fields in payload
    updatePayload.title = parsedContent.title;
    updatePayload.subtitle = parsedContent.subtitle;
    updatePayload.homepage_excerpt = parsedContent.homepage_excerpt;
    updatePayload.full_content = parsedContent.full_content;
    updatePayload.images = parsedContent.images;
    updatePayload.videos = parsedContent.videos;
    // 💡 UPDATED: Store the raw Tiptap JSON object
    updatePayload.tiptap_json_for_editing = body.tiptap_json_for_editing as any;
  }

  // 5. Execute Update
  try {
    const updatedArticles = await db
      .update(news)
      .set(updatePayload)
      .where(eq(news.id, articleId))
      .returning();

    const updatedArticle = updatedArticles[0];

    if (!updatedArticle) {
      // Should not happen if existence check passed, but good practice
      throw new Error('Failed to retrieve updated article data.');
    }

    // 6. Success Response
    return {
      message: 'News article updated successfully.',
      data: updatedArticle,
    };
  } catch (error) {
    // Re-throw H3 errors or catch DB errors
    const h3Error = error as any;
    if (h3Error.statusCode) {
      throw error;
    }
    console.error('Database Update Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage:
        'Internal Server Error: Failed to update the news article.',
    });
  }
});
