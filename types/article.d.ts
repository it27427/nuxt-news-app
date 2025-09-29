// types/article.d.ts

export interface NewsArticle {
  id: string;
  user_id: string;
  username: string;
  status: 'draft' | 'published';
  approval_status: 'draft' | 'pending' | 'approved';
  categories: string[];
  tags: string[];
  title: string;
  subtitle?: string;
  // Content data types remain TiptapNode[]
  homepage_excerpt: TiptapNode[];
  full_content: TiptapNode[];
  images?: Array<{ img_src: string; caption: string; credit: string }>;
  videos?: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;
  // 💡 UPDATED: Changed from quill_data_for_editing
  tiptap_json_for_editing: TiptapNode;
  created_at?: string;
  updated_at?: string;
}
