DO $$ BEGIN
 CREATE TYPE "public"."interval" AS ENUM('d', 'w', 'm', 'y');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "prices" ADD COLUMN "interval" interval;