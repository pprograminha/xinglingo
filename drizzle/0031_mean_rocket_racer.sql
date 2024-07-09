ALTER TABLE "conversations" ALTER COLUMN "recipientId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "recipientId" SET NOT NULL;