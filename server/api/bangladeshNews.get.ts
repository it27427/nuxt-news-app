import { readFile } from 'fs/promises';
import path from 'path';
import type { TopicItem } from '~~/types/news';

export default defineEventHandler(async () => {
  const filePath = path.resolve('content/topics/bangladesh.json');
  const fileContent = await readFile(filePath, 'utf-8');
  const jsonData: { data: TopicItem[] } = JSON.parse(fileContent);
  return jsonData;
});
