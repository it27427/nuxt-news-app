import mongoose, { Document } from 'mongoose';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid e-mail address.',
    ],
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    minLength: [11, 'Phone number must be at least 11 characters long.'],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password must be at least 8 characters long.'],
  },
});

export const User = mongoose.model<UserDocument>('User', userSchema);
