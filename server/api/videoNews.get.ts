import type { VideoItem } from '~~/types/news';
import { readFile } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
  const filePath = path.resolve('content/topics/video.json');
  const fileContent = await readFile(filePath, 'utf-8');
  const jsonData: { data: VideoItem[] } = JSON.parse(fileContent);
  return jsonData;
});
