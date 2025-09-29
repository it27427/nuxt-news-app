// types/draft.d.ts

import type { TiptapNode } from '~~/types/newstypes';

// Author Type (Provided by the user)
export interface Author {
  id: string;
  name: string;
  email: string;
}

// Draft Type - Updated to reflect the full article structure (SelectNews)
// required for editing, including Tiptap content fields.
export interface Draft {
  id: string;
  user_id: string;
  username: string | null;
  status: 'draft' | 'published';
  approval_status: 'draft' | 'pending' | 'approved';
  categories: string[];
  tags: string[];
  title: string;
  subtitle: string | null;

  // 💡 NEW CONTENT FIELDS: Replaced the old 'content: string'
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
  // NOTE: Author field is not needed here if user_id/username is provided,
  // but included for clarity if needed later for UI display.
}
