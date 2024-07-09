ALTER TABLE "conversations" ADD COLUMN "recipientId" uuid DEFAULT '0c3b884e-6da5-4072-bf48-68b5e3e9025f';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_recipientId_users_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
