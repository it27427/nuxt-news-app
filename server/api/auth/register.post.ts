import bcrypt from 'bcryptjs';
import { createError, defineEventHandler, readBody } from 'h3';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    const body = await readBody(event);
    const userName = body.userName?.trim();
    const email = body.email?.trim();
    const password = body.password;

    const errors: Record<string, string> = {};
    if (!userName) {
      errors.userName = 'Username is required.';
    } else if (userName.length < 3) {
      errors.userName = 'Username must be at least 3 characters.';
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email is invalid.';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, data: errors, message: 'Validation failed.' };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return {
        success: false,
        data: { email: 'This email is already registered.' },
        message: 'Email already exists.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email,
      },
      message: 'User successfully registered.',
    };
  } catch (err) {
    console.error('Server error during registration:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Server Error: Could not register user.',
      data: err,
    });
  }
});
