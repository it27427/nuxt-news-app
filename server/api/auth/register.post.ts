// /server/api/register.post.ts

import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

import { apiError, apiSuccess } from '@/utils/apiResponse';
import { validateField } from '@/utils/fieldValidator';
import { validateMessages } from '@/utils/messages';
import type { RegFormKeys } from '@/utils/types';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const body = await readBody(event);

    const userName = body.userName?.trim() || '';
    const email = body.email?.trim() || '';
    const password = body.password || '';

    const errors: Record<string, string> = {};

    // Centralized validation using validateField
    const formFields: RegFormKeys[] = ['userName', 'email', 'password'];
    formFields.forEach((field) => {
      const value = body[field] ?? '';
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    // Validation failed
    if (Object.keys(errors).length > 0) {
      return apiError(errors, validateMessages.validationFailed, 422);
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return apiError(
        { email: validateMessages.email.exists },
        validateMessages.emailAlreadyUsed,
        409
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    return apiSuccess(
      {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email,
      },
      validateMessages.registrationSuccess,
      201
    );
  } catch (err) {
    console.error('নিবন্ধনের সময় সার্ভার ত্রুটি:', err);
    return apiError({}, validateMessages.server, 500);
  }
});
