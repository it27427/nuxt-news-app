// types/approval.d.ts

import type { TiptapNode } from '~~/types/newstypes';

/**
 * Interface representing a news article in the Super Admin Approval panel.
 * Reflects the SelectNews structure but focuses on fields necessary for review.
 */
export interface ApprovalNews {
  id: string;
  user_id: string;
  username: string | null;
  status: 'draft' | 'published';
  approval_status: 'draft' | 'pending' | 'approved' | 'rejected';
  categories: string[];
  tags: string[];
  title: string;
  subtitle: string | null;

  // 💡 NEW CONTENT FIELDS: Replaced the old 'content: string' with Tiptap data
  homepage_excerpt: TiptapNode[];
  full_content: TiptapNode[];
  tiptap_json_for_editing: TiptapNode; // Content for the Tiptap editor

  images?: Array<{ img_src: string; caption: string; credit: string }>;
  videos?: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;

  created_at: string;
  updated_at: string;
}
