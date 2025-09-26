// server/db/schema.ts

import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Tags table
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
