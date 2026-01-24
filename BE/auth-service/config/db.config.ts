import mongoose from 'mongoose';
import 'dotenv/config';

const mongoUri = process.env.MONGO_URI;

export const initializeDatabase = async () => {
  try {
    if (!mongoUri) {
      throw new Error('Missing MONGO_URI environment variable');
    }

    await mongoose.connect(mongoUri);
    console.log('Auth Service connection to DB success!');
  } catch (error) {
    console.log('Auth Service connection to DB failed!', error);
  }
};
