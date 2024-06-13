ALTER TABLE "usersAvailability" ADD COLUMN "userId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersAvailability" ADD CONSTRAINT "usersAvailability_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "usersAvailability" ADD CONSTRAINT "usersAvailability_userId_unique" UNIQUE("userId");