// types/newstypes.d.ts

// Tiptap/ProseMirror Content Node Structure
export interface TiptapNode {
  type: string; // e.g., 'doc', 'paragraph', 'heading', 'image', 'video'
  content?: TiptapNode[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

// Define the structure of the extracted output data
export interface ParsedContent {
  title: string;
  subtitle: string | null;
  // homepage_excerpt and full_content are now arrays of Tiptap Nodes
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
