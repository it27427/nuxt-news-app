import { compare } from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { User } from '~~/server/models/User';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const errors: Record<string, string> = {};

  if (!email) errors.email = 'Email is required.';
  if (!password) errors.password = 'Password is required.';

  if (Object.keys(errors).length > 0) {
    return { success: false, data: errors, message: 'Validation failed.' };
  }

  const user = await User.findOne({ email });

  if (!user) {
    return {
      success: false,
      data: { email: 'User not found.' },
      message: 'Invalid email or password.',
    };
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return {
      success: false,
      data: { password: 'Invalid password.' },
      message: 'Invalid email or password.',
    };
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      userName: user.userName,
    },
    message: 'Login successful.',
  };
});
