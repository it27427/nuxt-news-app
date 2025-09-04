import { readFile } from 'fs/promises';
import { join } from 'path';
import type { PopularItem } from '~~/types/news';

export default defineEventHandler(async () => {
  try {
    // Path to JSON file in public folder
    const filePath = join(process.cwd(), 'server/data/home/popularNews.json');

    // Read JSON file
    const fileContent = await readFile(filePath, 'utf-8');

    // Parse JSON
    const jsonData: { data: PopularItem[] } = JSON.parse(fileContent);

    return jsonData;
  } catch (err) {
    console.error('Failed to read JSON file:', err);
    return { data: [] }; // fallback
  }
});
