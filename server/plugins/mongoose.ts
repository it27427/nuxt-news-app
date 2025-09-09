import mongoose from 'mongoose';

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(config.mongodbUri, {
        dbName: 'jonopath',
      });
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
    }
  }
});
