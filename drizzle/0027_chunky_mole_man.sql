CREATE TABLE IF NOT EXISTS "histories" (
	"id" integer PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"modelId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"slug" text,
	"image" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "histories" ADD CONSTRAINT "histories_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "histories" ADD CONSTRAINT "histories_modelId_models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
