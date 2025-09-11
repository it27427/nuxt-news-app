import mongoose, { Document } from 'mongoose';

export interface UserDocument extends Document {
  userName: string;
  email: string;
  password: string;
  admin?: boolean;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
