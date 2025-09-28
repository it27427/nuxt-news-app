import { eq } from 'drizzle-orm';
import { H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';

// Define a type for the authenticated user context
interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

/**
 * Global H3 Server Middleware to check for JWT token and authenticate the user.
 * This runs before every API route.
 */
export default defineEventHandler(async (event: H3Event) => {
  // 1. Skip non-API routes (e.g., HTML pages) or public endpoints (login, register)
  const url = event.node.req.url;
  if (url && (url.startsWith('/api/auth/') || url.startsWith('/api/public/'))) {
    return;
  }

  // 2. Extract Token from Authorization Header
  const authorizationHeader = event.node.req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    // If no token, allow the request to proceed, but context.user will be undefined.
    // Protected routes (like /api/tags) will then throw 403 themselves.
    return;
  }

  const token = authorizationHeader.substring(7); // Remove 'Bearer '
  const jwtSecret = process.env.JWT_SECRET || 'secret';

  try {
    // 3. Verify and Decode JWT Token
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
    };
    const userId = decoded.id;

    // 4. Fetch User from DB (Security check to ensure user still exists)
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser || dbUser.length === 0) {
      throw new Error('User not found in database.');
    }

    const user = dbUser[0];

    // 5. Inject User Context into H3 Event
    event.context.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    } as AuthUser;
  } catch (error) {
    // Log the authentication failure (e.g., token expired, invalid signature)
    console.warn('Authentication Failed:', (error as Error).message);
    // Do not throw an error here; just ensure context.user is not set.
    // Protected endpoints will check context.user and throw 401/403.
  }
});
