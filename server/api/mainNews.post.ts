import type { NewsItem } from '~~/types/news';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  // 1. Get the request body
  const body = await readBody<NewsItem>(event);

  if (!body || !body._id || !body.title) {
    return { error: 'Invalid data' };
  }

  // 2. Read existing JSON
  const filePath = path.resolve('content/home/mainNews.json');
  const fileContent = await readFile(filePath, 'utf-8');
  const jsonData: { data: NewsItem[] } = JSON.parse(fileContent);

  // 3. Add new item
  jsonData.data.push(body);

  // 4. Write back to the file
  await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

  return { success: true, data: body };
});
