// types/newstypes.d.ts

export interface DeltaOp {
  insert: string | { image: any } | { video: any };
  attributes?: any;
}

// Define the structure of the extracted output data
export interface ParsedContent {
  title: string;
  subtitle: string | null;
  homepage_excerpt: any[];
  full_content: any[];
  images: Array<{ img_src: string; caption: string; credit: string }>;
  videos: Array<{
    url: string;
    caption: string;
    credit: string;
    length: string;
  }>;
}
