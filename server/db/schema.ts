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

// Users table (for user and role definition)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  // role: 'admin' (standard writer) | 'reporter' | 'super_admin' (approver)
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Tags table (News Tags)
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Categories table (News Categories)
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// --- Application Specific Tables ---

// News Articles table (Main table for storing news)
export const news = pgTable('news', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Author & Metadata
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 100 }),

  // Statuses for Approval Flow
  // 💡 status: Final article state: 'draft' | 'published'
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  // 💡 approval_status: Approval workflow state: 'draft' | 'pending' | 'approved' | 'rejected'
  approval_status: varchar('approval_status', { length: 20 })
    .notNull()
    .default('draft'),

  // Selection Data (JSONB for storing multiple categories and tags)
  categories: jsonb('categories').notNull().$type<string[]>(),
  tags: jsonb('tags').notNull().$type<string[]>(),

  // Content Fields
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }),

  // Complex JSON/Quill Data (your custom organized content)
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

  // Full Quill Delta for editing (raw data required for editor to load)
  quill_data_for_editing: jsonb('quill_data_for_editing')
    .notNull()
    .$type<Array<any>>(),

  // Timestamps
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Approvals log (Log of every action in the approval process)
export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Which news article was acted upon
  news_id: uuid('news_id')
    .notNull()
    .references(() => news.id, { onDelete: 'cascade' }),
  // Who performed the action (Super Admin/Admin)
  acted_by: uuid('acted_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  // action: 'sent_for_review' | 'approved' | 'rejected' | 'pending' | 'published_direct'
  action: varchar('action', { length: 50 }).notNull(),
  comment: text('comment'), // Reason for rejection or approval note
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// News Views & Analytics table (for storing analytics data)
export const news_views = pgTable('news_views', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Which article view is this for
  news_id: uuid('news_id')
    .notNull()
    .references(() => news.id, { onDelete: 'cascade' }),

  // User ID (null if reader is not logged in)
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),

  // Session ID (to track unique visitors)
  session_id: varchar('session_id', { length: 256 }).notNull(),

  // Time spent reading (in seconds)
  time_spent_seconds: integer('time_spent_seconds').default(0).notNull(),

  // Ad clicks
  ad_clicks: integer('ad_clicks').default(0).notNull(),

  viewed_at: timestamp('viewed_at').defaultNow().notNull(),
});

// Notifications table (User notifications)
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),

  // The user who receives the notification
  recipient_user_id: uuid('recipient_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // The news article related to the notification (e.g., 'News has been rejected')
  news_id: uuid('news_id').references(() => news.id, { onDelete: 'set null' }),

  message: varchar('message', { length: 512 }).notNull(),
  read: boolean('read').notNull().default(false), // Whether the notification has been read

  created_at: timestamp('created_at').defaultNow().notNull(),
});
