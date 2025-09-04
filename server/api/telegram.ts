import path from 'path';
import readline from 'readline';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

const apiId = 26312758; // your API_ID
const apiHash = '8d2f05305f90bb5221d64d81fd66b7eb'; // your API_HASH
const channelUsername = 'CIG_telegram';

// Empty session initially (you can store logged-in session later)
const stringSession = new StringSession('');

// helper function for input
function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

export default defineEventHandler(async (event) => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () =>
      await ask('Enter your phone number (linked to Telegram): '),
    password: async () => await ask('Enter your 2FA password (if any): '),
    phoneCode: async () => await ask('Enter the code you received: '),
    onError: (err) => console.log(err),
  });

  const result: any[] = [];
  const limit = 10;

  const messages = await client.getMessages(channelUsername, { limit });

  for (const message of messages) {
    const msgData: any = {
      id: message.id,
      date: message.date,
      text: message.message || '',
      views: (message as any).views || null,
      media: null,
    };

    // Handle media (photo/document)
    if (message.media) {
      const filePath = path.join('downloads', `${message.id}`);
      await client.downloadMedia(message.media, {
        outputFile: filePath,
      });
      msgData.media = filePath;
    }

    result.push(msgData);
  }

  await client.disconnect();
  return result;
});
