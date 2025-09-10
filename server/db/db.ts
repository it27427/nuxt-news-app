// /server/db.ts
import { Db, MongoClient } from 'mongodb';

let client: MongoClient;
let database: Db;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'jonopath';

if (!MONGO_URI)
  throw new Error('Please define the MONGO_URI environment variable');

async function connectDB() {
  if (database) return database;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  database = client.db(DB_NAME);
  console.log('MongoDB connected:', DB_NAME);
  return database;
}

export const db = {
  get client() {
    return client;
  },
  async user() {
    const dbInstance = await connectDB();
    return dbInstance.collection('users');
  },
};
