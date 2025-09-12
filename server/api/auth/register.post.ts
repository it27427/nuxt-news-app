import bcrypt from 'bcryptjs';
import { createError, defineEventHandler, readBody } from 'h3';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

export default defineEventHandler(async (event) => {
  try {
    // Connect to the database
    await connectDB();

    // Read data from the request body
    const body = await readBody(event);
    const userName = body.userName?.trim();
    const email = body.email?.trim();
    const password = body.password;

    // Perform initial data validation
    const errors: Record<string, string> = {};
    if (!userName) {
      errors.userName = 'ব্যবহারকারীর নাম আবশ্যক।';
    } else if (userName.length < 3) {
      errors.userName = 'ব্যবহারকারীর নাম কমপক্ষে ৩ অক্ষরের হতে হবে।';
    }

    // Validate if email is provided
    if (!email) {
      errors.email = 'ইমেইল আবশ্যক।';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      // Validate email format
      errors.email = 'ইমেইল ফরম্যাট ভুল হয়েছে। সঠিকভাবে লিখুন।';
    }

    if (!password || password.length < 8) {
      errors.password = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।';
    }

    // If there are any validation errors, return them
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        data: errors,
        message: 'যাচাইকরণ ব্যর্থ হয়েছে।',
      };
    }

    // Check if the email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return {
        success: false,
        data: { email: 'এই ইমেলটি ইতিমধ্যেই নিবন্ধিত।' },
        message: 'এই ইমেলটি ইতিমধ্যেই ব্যবহৃত হয়েছে।',
      };
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Respond if the user is successfully registered
    return {
      success: true,
      user: {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email,
      },
      message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত হয়েছে।',
    };
  } catch (err) {
    // Catch and handle any server-side errors
    console.error('নিবন্ধনের সময় সার্ভার ত্রুটি:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'সার্ভার ত্রুটি: ব্যবহারকারীকে নিবন্ধন করা যায়নি।',
      data: err,
    });
  }
});
