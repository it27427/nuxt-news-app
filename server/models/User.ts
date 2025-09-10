import mongoosePkg from 'mongoose';
const { Schema, model, models } = mongoosePkg;

export interface UserDocument extends mongoosePkg.Document {
  userName: string;
  email: string;
  password: string;
  admin?: boolean;
}

const userSchema = new Schema<UserDocument>({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

export const User = models.User || model<UserDocument>('User', userSchema);
