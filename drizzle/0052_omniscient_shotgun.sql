ALTER TYPE "client" ADD VALUE 'cloudflare_s3';--> statement-breakpoint
ALTER TABLE "speechs" ALTER COLUMN "client" SET DEFAULT 'cloudflare_s3';