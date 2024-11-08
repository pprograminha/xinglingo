ALTER TABLE "conversations" ALTER COLUMN "text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "content" jsonb[];--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "parentConversationId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_parentConversationId_conversations_id_fk" FOREIGN KEY ("parentConversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
