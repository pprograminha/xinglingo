ALTER TABLE "users" ADD COLUMN "googleId" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_googleId_unique" UNIQUE("googleId");