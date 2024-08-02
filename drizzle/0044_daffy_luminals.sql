ALTER TABLE "lessons" ADD COLUMN "title" uuid;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "prompt" uuid;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "description" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_title_texts_id_fk" FOREIGN KEY ("title") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_prompt_texts_id_fk" FOREIGN KEY ("prompt") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_description_texts_id_fk" FOREIGN KEY ("description") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
