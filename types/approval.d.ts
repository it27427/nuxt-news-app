// types/approval.d.ts

import type { TiptapNode } from '~~/types/newstypes';

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

  homepage_excerpt: TiptapNode[];
  full_content: TiptapNode[];
  tiptap_json_for_editing: TiptapNode;

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
