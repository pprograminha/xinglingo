ALTER TABLE "units" ADD COLUMN "title" uuid;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "description" uuid;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "prompt" uuid;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "slug" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "units" ADD CONSTRAINT "units_title_texts_id_fk" FOREIGN KEY ("title") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "units" ADD CONSTRAINT "units_description_texts_id_fk" FOREIGN KEY ("description") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "units" ADD CONSTRAINT "units_prompt_texts_id_fk" FOREIGN KEY ("prompt") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "units" ADD CONSTRAINT "units_slug_texts_id_fk" FOREIGN KEY ("slug") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
