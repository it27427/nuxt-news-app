import bcrypt from 'bcryptjs';
import { createError, defineEventHandler, readBody, sendError } from 'h3';
import { User } from '~~/server/models/User';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userName, email, password } = body;

  const errors: Record<string, string> = {};

  if (!userName || userName.length < 3)
    errors.userName = 'User name must be at least 3 characters';

  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    errors.email = 'Email is invalid';

  if (!password || password.length < 8)
    errors.password = 'Password must be at least 8 characters';

  if (Object.keys(errors).length > 0) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: 'Validation failed',
        data: errors,
      })
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: 'Email already exists',
        data: { email: 'Email already registered' },
      })
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ userName, email, password: hashedPassword });

  return {
    success: true,
    user: {
      id: user._id.toString(),
      userName: user.userName,
      email: user.email,
    },
  };
});
