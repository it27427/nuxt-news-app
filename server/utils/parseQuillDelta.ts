// server/utils/parseQuillDelta.ts

import { DeltaOp, ParsedContent } from '~~/types/newstypes';

/**
 * Parses the Quill Delta JSON structure to extract structured data
 * required for database storage and content rendering.
 * * Specifically extracts Title, Subtitle, Images (with caption/credit),
 * Videos (with caption/credit), and a homepage excerpt.
 * * @param deltaOps The array of Quill Delta operations (ops).
 * @returns A ParsedContent object with extracted fields.
 */

export function parseQuillDelta(deltaOps: DeltaOp[]): ParsedContent {
  const result: ParsedContent = {
    title: '',
    subtitle: null,
    homepage_excerpt: [],
    full_content: [],
    images: [],
    videos: [],
  };

  let titleExtracted = false;
  let subtitleExtracted = false;
  let excerptLength = 0;
  const MAX_EXCERPT_ELEMENTS = 3; // Use the first 3 elements for the homepage excerpt

  // 1. Iterate through all Delta Operations
  for (const op of deltaOps) {
    // Add all operations to full_content (required for loading back into the editor)
    result.full_content.push(op);

    const insert = op.insert;
    const attributes = op.attributes;

    // --- A. Title and Subtitle Extraction (Block Formats) ---

    // Title and Subtitle are typically text inserted just before a newline
    // that carries the block-level attribute (e.g., newsTitle: true).
    if (typeof insert === 'string' && insert.endsWith('\n')) {
      const content = insert.trim();

      // Extract News Title
      if (!titleExtracted && attributes?.newsTitle && content.length > 0) {
        result.title = content;
        titleExtracted = true;
        continue; // Title extracted, move to next op
      }

      // Extract News Subtitle
      if (
        titleExtracted &&
        !subtitleExtracted &&
        attributes?.newsSubtitle &&
        content.length > 0
      ) {
        result.subtitle = content;
        subtitleExtracted = true;
        // continue; // Keep processing for excerpt/media
      }
    }

    // --- B. Media (Image/Video) and Excerpt Extraction ---

    // Check for Image Insert
    if (typeof insert === 'object' && 'image' in insert) {
      const imgSrc = insert.image;
      const caption = attributes?.['data-caption'] || '';
      const credit = attributes?.['data-credit'] || '';

      result.images.push({ img_src: imgSrc, caption, credit });

      // Add image placeholder to excerpt if not full
      if (excerptLength < MAX_EXCERPT_ELEMENTS) {
        result.homepage_excerpt.push({ image: imgSrc, caption });
        excerptLength++;
      }
    }

    // Check for Video Insert
    if (typeof insert === 'object' && 'video' in insert) {
      const videoUrl = insert.video;
      const caption = attributes?.['data-caption'] || '';
      const credit = attributes?.['data-credit'] || '';
      // Note: 'length' is not provided by the Quill editor, but kept for schema compatibility
      const length = '';

      result.videos.push({ url: videoUrl, caption, credit, length });

      // Add video placeholder to excerpt if not full
      if (excerptLength < MAX_EXCERPT_ELEMENTS) {
        result.homepage_excerpt.push({ video: videoUrl, caption });
        excerptLength++;
      }
    }

    // Check for Text Excerpt
    if (
      typeof insert === 'string' &&
      insert.trim().length > 0 &&
      excerptLength < MAX_EXCERPT_ELEMENTS
    ) {
      // Take the first non-title/subtitle text block for the excerpt
      if (!attributes?.newsTitle && !attributes?.newsSubtitle) {
        const textExcerpt =
          insert.trim().substring(0, 150) +
          (insert.trim().length > 150 ? '...' : '');
        result.homepage_excerpt.push({ text: textExcerpt });
        excerptLength++;
      }
    }
  }

  // 2. Final data cleaning and structuring (optional, but good practice)
  // Ensure homepage_excerpt is limited to a small size
  result.homepage_excerpt = result.homepage_excerpt.slice(
    0,
    MAX_EXCERPT_ELEMENTS
  );

  return result;
}
