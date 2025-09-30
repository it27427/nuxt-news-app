// types/article.d.ts

export interface TiptapDoc {
  type: 'doc';
  content: Array<any>;
}

export interface ArticleCreationPayload {
  categories: string[];
  tags: string[];
  tiptap_json_for_editing: TiptapDoc;
  approval_status?: 'draft' | 'pending' | 'approved';
}

export interface NewsArticle extends ArticleCreationPayload {
  id: string;
  user_id: string;
  username: string;
  status: 'draft' | 'published';
  approval_status: 'draft' | 'pending' | 'approved';
  categories: string[];
  tags: string[];

  homepage_excerpt: any[]; 
  full_content: any[]; 

  images?: Array<{ img_src: string; caption: string; credit: string }>;
  videos?: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;

  tiptap_json_for_editing: TiptapDoc;
  created_at?: string;
  updated_at?: string;
}
