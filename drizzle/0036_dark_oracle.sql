ALTER TABLE "lessons" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "prompt" text;--> statement-breakpoint
ALTER TABLE "userLessons" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "userSections" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userLessons" ADD CONSTRAINT "userLessons_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userSections" ADD CONSTRAINT "userSections_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN IF EXISTS "completed";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN IF EXISTS "current";