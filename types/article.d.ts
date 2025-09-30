// types/article.d.ts

export interface NewsArticle {
  id: string;
  user_id: string;
  username: string;
  status: 'draft' | 'published';
  approval_status: 'draft' | 'pending' | 'approved';
  categories: string[];
  tags: string[];

  homepage_excerpt: TiptapNode[];
  full_content: TiptapNode[];
  images?: Array<{ img_src: string; caption: string; credit: string }>;
  videos?: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;

  tiptap_json_for_editing: TiptapNode;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleCreationPayload {
  title: string;
  subtitle: string | null;
  categories: string[];
  tags: string[];
  tiptap_json_for_editing: TiptapNode;
}
