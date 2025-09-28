import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
// Fix: 'createInsertSchema' and 'createSelectSchema' are usually imported
// from a companion library like 'drizzle-zod' for validation schemas.
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { approvals, news, users } from '~~/server/db/schema'; // Imported schema tables

// --- User Models ---

export const InsertUserSchema = createInsertSchema(users);
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;

// --- News Article Models ---

/**
 * Type used for inserting a new row into the 'news' table.
 * Drizzle automatically excludes columns with default values in the schema
 * (e.g., 'id', 'created_at', 'updated_at').
 */
export const InsertNewsSchema = createInsertSchema(news);
export type InsertNews = InferInsertModel<typeof news>;

/**
 * Type used for selecting data from the 'news' table.
 */
export const SelectNewsSchema = createSelectSchema(news);
export type SelectNews = InferSelectModel<typeof news>;

// --- Approvals Log Models ---

/**
 * Type used for inserting a new row into the 'approvals' table.
 */
export const InsertApprovalSchema = createInsertSchema(approvals);
export type InsertApproval = InferInsertModel<typeof approvals>;

/**
 * Type used for selecting data from the 'approvals' table.
 */
export const SelectApprovalSchema = createSelectSchema(approvals);
export type SelectApproval = InferSelectModel<typeof approvals>;
