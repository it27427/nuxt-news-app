// server/api/admin/news/utils.ts

import { ParsedContent, TiptapNode } from '~~/types/newstypes';

export function validateAndParseTiptap(
  tiptap_json_for_editing: TiptapNode
): ParsedContent {
  if (!tiptap_json_for_editing || tiptap_json_for_editing.type !== 'doc') {
    throw new Error('Invalid Tiptap content.');
  }

  if (
    !Array.isArray(tiptap_json_for_editing.content) ||
    !tiptap_json_for_editing.content.length
  ) {
    throw new Error('Tiptap content cannot be empty.');
  }

  const parsed = parseTiptapJson(tiptap_json_for_editing);

  if (!parsed.title) {
    throw new Error('Article title is required.');
  }

  return parsed;
}

export function determineStatus(
  userRole: 'admin' | 'super_admin' | 'reporter'
) {
  if (userRole === 'super_admin') {
    return {
      status: 'published',
      approval_status: 'approved',
      action: 'published_direct',
    };
  }
  return {
    status: 'submitted',
    approval_status: 'reviewing',
    action: 'sent_for_review',
  };
}
