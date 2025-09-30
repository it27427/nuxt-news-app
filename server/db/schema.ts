// server/db/schema.ts

import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// --- Core Tables ---

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// --- Application Specific Tables ---

export const news = pgTable('news', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Author & Metadata
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 100 }),

  // Status Flow
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  approval_status: varchar('approval_status', { length: 20 })
    .notNull()
    .default('draft'),

  // Selection Data
  categories: jsonb('categories').notNull().$type<string[]>(),
  tags: jsonb('tags').notNull().$type<string[]>(),

  // Complex JSON/Tiptap Data
  homepage_excerpt: jsonb('homepage_excerpt').notNull().$type<Array<any>>(),
  full_content: jsonb('full_content').notNull().$type<Array<any>>(),
  images:
    jsonb('images').$type<
      Array<{ img_src: string; caption: string; credit: string }>
    >(),
  videos:
    jsonb('videos').$type<
      Array<{ url: string; caption: string; credit: string; length: string }>
    >(),

  // Only Tiptap JSON (single source of truth for title + subtitle + content)
  tiptap_json_for_editing: jsonb('tiptap_json_for_editing')
    .notNull()
    .$type<{ type: 'doc'; content: Array<any> }>(),

  // Timestamps
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  news_id: uuid('news_id')
    .notNull()
    .references(() => news.id, { onDelete: 'cascade' }),
  acted_by: uuid('acted_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 50 }).notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const news_views = pgTable('news_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  news_id: uuid('news_id')
    .notNull()
    .references(() => news.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  session_id: varchar('session_id', { length: 256 }).notNull(),
  time_spent_seconds: integer('time_spent_seconds').default(0).notNull(),
  ad_clicks: integer('ad_clicks').default(0).notNull(),
  viewed_at: timestamp('viewed_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipient_user_id: uuid('recipient_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  news_id: uuid('news_id').references(() => news.id, { onDelete: 'set null' }),
  message: varchar('message', { length: 512 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('general'),
  read: boolean('read').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
