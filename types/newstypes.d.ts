// Tiptap/ProseMirror Content Node Structure

export interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export interface CustomImageOptions {
  src: string;
  caption?: string | null;
  source?: string | null;
}

export interface CustomYoutubeOptions {
  src: string;
  caption?: string | null;
  source?: string | null;
  videoLength?: string | null;
}

export interface ParsedContent {
  title: string;
  subtitle: string | null;
  homepage_excerpt: TiptapNode[];
  full_content: TiptapNode[];
  images: Array<{ img_src: string; caption: string; credit: string }>;
  videos: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;
}
