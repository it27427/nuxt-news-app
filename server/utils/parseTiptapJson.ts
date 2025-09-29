// server/utils/parseTiptapJson.ts

import { ParsedContent, TiptapNode } from '~~/types/newstypes';

/**
 * Parses Tiptap/ProseMirror JSON content to extract structured data
 * (Title, Subtitle, Excerpt, Images, Videos, Full Content).
 * * @param jsonDoc The full Tiptap JSON document (the value of 'tiptap_json_for_editing').
 * @returns ParsedContent object with extracted fields.
 */
export function parseTiptapJson(jsonDoc: TiptapNode): ParsedContent {
  // Ensure the top-level node is a 'doc' and has content
  if (
    jsonDoc.type !== 'doc' ||
    !jsonDoc.content ||
    jsonDoc.content.length === 0
  ) {
    throw new Error('Invalid Tiptap/ProseMirror JSON document structure.');
  }

  const nodes = jsonDoc.content;

  // --- Initialization ---
  let title: string | null = null;
  let subtitle: string | null = null;
  let homepage_excerpt: TiptapNode[] = [];
  let full_content: TiptapNode[] = [];
  const images: ParsedContent['images'] = [];
  const videos: ParsedContent['videos'] = [];

  // --- Core Parsing Logic ---

  // 1. Extract Title and Subtitle (assuming they are h1 and h2)
  if (nodes[0]?.type === 'heading' && nodes[0].attrs?.level === 1) {
    // Extract text from H1 node's content, join if multiple text nodes
    title =
      nodes[0].content
        ?.map((c) => c.text)
        .join(' ')
        .trim() || null;
    // Push H1 to full_content only if it's not the only content
    if (nodes.length > 1) {
      full_content.push(nodes[0]);
    }
  }

  if (title && nodes[1]?.type === 'heading' && nodes[1].attrs?.level === 2) {
    // Extract text from H2 node
    subtitle =
      nodes[1].content
        ?.map((c) => c.text)
        .join(' ')
        .trim() || null;
    full_content.push(nodes[1]);
  }

  // 2. Determine where the main content starts after Title/Subtitle
  let contentStartIndex = 0;
  if (title && subtitle) {
    contentStartIndex = 2; // Skipped H1 and H2
  } else if (title) {
    contentStartIndex = 1; // Skipped H1
  }

  // 3. Extract Homepage Excerpt (the first paragraph/block after title/subtitle)
  const firstContentNode = nodes[contentStartIndex];
  if (firstContentNode) {
    // Check if the first node is a standard text block (paragraph, list, etc.)
    if (
      firstContentNode.type !== 'image' &&
      firstContentNode.type !== 'video'
    ) {
      // Keep only the first block node as excerpt (e.g., the first paragraph)
      homepage_excerpt.push(firstContentNode);
    }
  }

  // 4. Populate Full Content and Media Arrays
  for (let i = contentStartIndex; i < nodes.length; i++) {
    const node = nodes[i];

    // Add all nodes after the title/subtitle to full_content
    // The excerpt node is included here as well.
    full_content.push(node);

    if (node.type === 'image' && node.attrs) {
      // 💡 Logic: First image found is the featured image
      if (images.length === 0) {
        images.push({
          img_src: node.attrs.src || '',
          caption: node.attrs.caption || '', // Assuming Tiptap extension adds caption/credit
          credit: node.attrs.credit || '',
        });
      }
    } else if (node.type === 'video' && node.attrs) {
      // Collect all video data
      videos.push({
        url: node.attrs.url || '',
        caption: node.attrs.caption || '',
        credit: node.attrs.credit || '',
        length: node.attrs.length || '', // Assuming Tiptap extension adds length
      });
    }
  }

  // Final check for Title (Mandatory)
  if (!title) {
    throw new Error(
      'Title (H1) is required as the first element of the article content.'
    );
  }

  // Return the structured data
  return {
    title: title,
    subtitle: subtitle,
    homepage_excerpt: homepage_excerpt,
    full_content: full_content,
    images: images,
    videos: videos,
  };
}
