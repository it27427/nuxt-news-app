// types/server.d.ts

declare module '~/server/db/db' {
  import { DrizzleDatabase } from 'drizzle-orm';
  export const db: DrizzleDatabase;
}

declare module '~/server/db/schema' {
  import { pgTable } from 'drizzle-orm/pg-core';
  export const users: ReturnType<typeof pgTable>;
}

declare module '~/server/utils/error' {
  export function throwError(
    statusCode: number,
    message: string,
    fields?: Record<string, string>
  ): never;
}
