// server/middleware/auth.ts

import { eq } from 'drizzle-orm';
import { createError, getCookie, H3Event, sendError } from 'h3';
import jwt from 'jsonwebtoken';
import { db } from '~~/server/db/db';
import { users } from '~~/server/db/schema';

export default defineEventHandler(async (event: H3Event) => {
  const url = event.node.req.url;

  if (!url?.startsWith('/api/') || url.startsWith('/api/auth/')) {
    return;
  }

  let token: string | null = event.node.req.headers.authorization?.startsWith(
    'Bearer '
  )
    ? event.node.req.headers.authorization.substring(7)
    : getCookie(event, 'auth_token') || null;

  if (!token) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    );
  }

  const jwtSecret = process.env.JWT_SECRET || 'secret';

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
    };

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (!dbUser || dbUser.length === 0) {
      return sendError(
        event,
        createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      );
    }

    const user = dbUser[0];
    event.context.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (err) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Invalid Token' })
    );
  }
});
