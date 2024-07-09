ALTER TABLE "histories" ADD COLUMN "modelId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "histories" ADD CONSTRAINT "histories_modelId_models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
