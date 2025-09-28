import { eq } from 'drizzle-orm';
import { getCookie, H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'reporter';
}

export default defineEventHandler(async (event: H3Event) => {
  const url = event.node.req.url;

  if (
    !url?.startsWith('/api/') ||
    url.startsWith('/api/auth/') ||
    url.startsWith('/api/public/')
  ) {
    return;
  }

  let token: string | null = event.node.req.headers.authorization?.startsWith(
    'Bearer '
  )
    ? event.node.req.headers.authorization.substring(7)
    : getCookie(event, 'auth_token') || null;

  if (!token) return;

  const jwtSecret = process.env.JWT_SECRET || 'secret';

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
    };
    const userId = decoded.id;

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!dbUser || dbUser.length === 0) return;

    const user = dbUser[0];

    event.context.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    } as AuthUser;
  } catch (err) {
    console.warn('Authentication failed:', (err as Error).message);
  }
});
