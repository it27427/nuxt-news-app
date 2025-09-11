import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB is already connected.');
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });

    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
};
