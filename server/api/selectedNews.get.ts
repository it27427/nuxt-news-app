import type { NewsItem } from '~~/types/news';
import { readFile } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
  const filePath = path.resolve('content/home/selectedNews.json');
  const fileContent = await readFile(filePath, 'utf-8');
  const jsonData: { data: NewsItem[] } = JSON.parse(fileContent);
  return jsonData;
});
