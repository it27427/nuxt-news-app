import { readFile } from 'fs/promises';
import path from 'path';
import type { NewsItem } from '~~/types/news';

export default defineEventHandler(async () => {
  const filePath = path.join(
    process.cwd(),
    'public/data/home/selectedNews.json'
  );
  const fileContent = await readFile(filePath, 'utf-8');
  const jsonData: { data: NewsItem[] } = JSON.parse(fileContent);
  return jsonData;
});
