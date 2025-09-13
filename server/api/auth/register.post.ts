// /server/api/register.post.ts

import { validateField } from '@/utils/fieldValidator';
import { validateMessages } from '@/utils/messages';
import type { RegFormKeys } from '@/utils/types';
import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const body = await readBody(event);

    const userName = body.userName?.trim() || '';
    const email = body.email?.trim() || '';
    const password = body.password || '';

    const errors: Record<string, string> = {};

    // centralized validation
    ['userName', 'email', 'password'].forEach((field) => {
      const value = body[field as RegFormKeys] ?? '';
      const error = validateField(field as RegFormKeys, value);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length) {
      return {
        success: false,
        message: validateMessages.validationFailed,
        data: errors,
      };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return {
        success: false,
        message: validateMessages.emailAlreadyUsed,
        data: { email: validateMessages.email.exists },
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
      message: validateMessages.registrationSuccess,
      data: {
        user: {
          id: user._id.toString(),
          userName: user.userName,
          email: user.email,
        },
      },
    };
  } catch (err) {
    console.error('Registration error:', err);
    return {
      success: false,
      message: validateMessages.server,
      data: {},
    };
  }
});
