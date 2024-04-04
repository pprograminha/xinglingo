ALTER TABLE "pronunciationsAssessment" DROP CONSTRAINT "pronunciationsAssessment_conversationId_conversations_id_fk";
--> statement-breakpoint
ALTER TABLE "pronunciationsAssessment" ADD COLUMN "creatorId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pronunciationsAssessment" ADD CONSTRAINT "pronunciationsAssessment_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pronunciationsAssessment" ADD CONSTRAINT "pronunciationsAssessment_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
