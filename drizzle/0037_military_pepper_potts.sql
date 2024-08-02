CREATE TABLE IF NOT EXISTS "texts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"parentId" uuid,
	"locale" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "modelId" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "texts" ADD CONSTRAINT "texts_parentId_texts_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN IF EXISTS "prompt";--> statement-breakpoint
ALTER TABLE "units" DROP COLUMN IF EXISTS "slug";