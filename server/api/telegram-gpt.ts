import { defineEventHandler } from 'h3';
import OpenAI from 'openai';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
  });

  const BOT_TOKEN = config.TELEGRAM_BOT_TOKEN;

  // Fetch channel updates
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
  );
  const data = await res.json();

  console.log('Telegram API response:', data);

  // Guard against missing updates
  if (!data.ok || !Array.isArray(data.result)) {
    return {
      raw: [],
      summary: 'No messages found. Make sure your bot is added to the channel.',
    };
  }

  const messages = data.result
    .map((u: any) => u.message?.text)
    .filter(Boolean)
    .slice(-10);

  if (messages.length === 0) {
    return {
      raw: [],
      summary: 'No text messages found.',
    };
  }

  // Send to GPT-4 for summarization
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant that summarizes Telegram channel messages.',
      },
      {
        role: 'user',
        content: `Summarize these messages:\n\n${messages.join('\n')}`,
      },
    ],
  });

  return {
    raw: messages,
    summary: completion.choices[0].message?.content,
  };
});
