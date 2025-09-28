// server/utils/auth.ts

import { H3Event, createError } from 'h3';

// Define the assumed structure of the authenticated user
interface AuthUser {
  id: string;
  role: 'admin' | 'super_admin' | 'reporter' | 'reader';
}

/**
 * Ensures that the authenticated user has ONLY the 'super_admin' role.
 * This function is used for high-security configuration changes (like tags/categories).
 * If the user is unauthorized or unauthenticated, it throws an H3 error.
 * @param event The H3Event object containing the user context.
 */
export function ensureAdmin(event: H3Event): AuthUser {
  const authUser = event.context.user as AuthUser | undefined;

  // 1. Check Authentication
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication required.',
    });
  }

  // 2. Check Authorization (Only Super Admin role is allowed)
  if (authUser.role !== 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage:
        'Forbidden: Insufficient privileges. Only Super Admins can perform this action.',
    });
  }

  return authUser;
}

/**
 * Ensures that the authenticated user has a valid session (any recognized role).
 * This check is used for actions that require a logged-in user but not a specific high-level role.
 * @param event The H3Event object containing the user context.
 */
export function ensureAuthenticated(event: H3Event): AuthUser {
  const authUser = event.context.user as AuthUser | undefined;

  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication required.',
    });
  }

  return authUser;
}
