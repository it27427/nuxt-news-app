import gameNewsData from '~~/server/data/topics/economy.json';
import type { TopicItem } from '~~/types/news';

export default defineEventHandler(async () => {
  try {
    // Parse JSON
    const jsonData: { data: TopicItem[] } = gameNewsData as any;

    return jsonData;
  } catch (err) {
    console.error('Failed to read JSON file:', err);
    return { data: [] }; // fallback
  }
});
