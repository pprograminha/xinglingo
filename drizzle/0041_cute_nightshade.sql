ALTER TABLE "sections" ADD COLUMN "title" uuid;--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "prompt" uuid;--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "slug" uuid;--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "description" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sections" ADD CONSTRAINT "sections_title_texts_id_fk" FOREIGN KEY ("title") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sections" ADD CONSTRAINT "sections_prompt_texts_id_fk" FOREIGN KEY ("prompt") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sections" ADD CONSTRAINT "sections_slug_texts_id_fk" FOREIGN KEY ("slug") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sections" ADD CONSTRAINT "sections_description_texts_id_fk" FOREIGN KEY ("description") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
