ALTER TABLE "news" ADD COLUMN "tiptap_json_for_editing" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "news" DROP COLUMN "quill_data_for_editing";