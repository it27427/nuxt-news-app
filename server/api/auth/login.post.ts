import { compare } from 'bcryptjs';
import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    setResponseStatus(event, 400); // Bad Request
    return {
      message: 'ইমেল এবং পাসওয়ার্ড অবশ্যই বাধ্যতামূলক।',
    };
  }

  await connectDB();

  // Fixing the TypeScript error by casting the User model.
  const user = await (User as Model<any>).findOne({ email });

  if (!user) {
    setResponseStatus(event, 401); // Unauthorized
    return {
      message: 'ইমেল বা পাসওয়ার্ড বৈধ নয়।',
    };
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    setResponseStatus(event, 401); // Unauthorized
    return {
      message: 'ইমেল বা পাসওয়ার্ড বৈধ নয়।',
    };
  }

  // Correcting the import and function call for jsonwebtoken
  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      admin: user.admin || false,
    },
    useRuntimeConfig().auth.secret,
    { expiresIn: '1h' }
  );

  setResponseStatus(event, 200); // OK
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      admin: user.admin || false,
    },
  };
});
