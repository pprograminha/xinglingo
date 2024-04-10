DO $$ BEGIN
 CREATE TYPE "client" AS ENUM('cloudflare-s3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speechs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"speech" text,
	"client" "client" DEFAULT 'cloudflare-s3' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speechsToConversations" (
	"speechId" uuid,
	"conversationId" uuid,
	CONSTRAINT "speechsToConversations_speechId_conversationId_pk" PRIMARY KEY("speechId","conversationId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speechsToConversations" ADD CONSTRAINT "speechsToConversations_speechId_speechs_id_fk" FOREIGN KEY ("speechId") REFERENCES "speechs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speechsToConversations" ADD CONSTRAINT "speechsToConversations_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
