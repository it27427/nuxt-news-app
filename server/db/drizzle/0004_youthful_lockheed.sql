ALTER TABLE "notifications" ADD COLUMN "type" varchar(50) DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "news" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "news" DROP COLUMN "subtitle";