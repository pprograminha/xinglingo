DO $$ BEGIN
 CREATE TYPE "public"."intervalVariant" AS ENUM('day', 'week', 'month', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "prices" ADD COLUMN "intervalVariant" "intervalVariant";