ALTER TABLE "histories" DROP CONSTRAINT "histories_modelId_models_id_fk";
--> statement-breakpoint
ALTER TABLE "histories" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "models" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "histories" DROP COLUMN IF EXISTS "modelId";