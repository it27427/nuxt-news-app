// /server/api/register.post.ts

import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

import { apiError, apiSuccess } from '@/utils/apiResponse';
import { errorMessages } from '@/utils/messages';
import { emailRegex } from '@/utils/validators';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const body = await readBody(event);
    const userName = body.userName?.trim();
    const email = body.email?.trim();
    const password = body.password;

    const errors: Record<string, string> = {};

    // Validate username
    if (!userName) errors.userName = errorMessages.userName.required;
    else if (userName.length < 3)
      errors.userName = errorMessages.userName.minLength;

    // Validate email
    if (!email) errors.email = errorMessages.email.required;
    else if (!emailRegex.test(email))
      errors.email = errorMessages.email.invalid;

    // Validate password
    if (!password) errors.password = errorMessages.password.required;
    else if (password.length < 8)
      errors.password = errorMessages.password.minLength;

    // Validation failed
    if (Object.keys(errors).length > 0) {
      return apiError(errors, errorMessages.validationFailed, 422);
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return apiError(
        { email: errorMessages.email.exists },
        errorMessages.emailAlreadyUsed,
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
      errorMessages.registrationSuccess,
      201
    );
  } catch (err) {
    console.error('নিবন্ধনের সময় সার্ভার ত্রুটি:', err);
    return apiError({}, errorMessages.server, 500);
  }
});
