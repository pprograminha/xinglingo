DO $$ BEGIN
 CREATE TYPE "public"."duration" AS ENUM('forever', 'once', 'repeating');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"amount_off" integer,
	"created" integer NOT NULL,
	"currency" text,
	"deleted" boolean DEFAULT false NOT NULL,
	"duration" "duration" NOT NULL,
	"duration_in_months" integer,
	"livemode" boolean NOT NULL,
	"max_redemptions" integer,
	"metadata" jsonb,
	"name" text,
	"percent_off" integer,
	"redeem_by" integer,
	"times_redeemed" integer NOT NULL,
	"valid" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promotionCodes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text,
	"coupon" text,
	"created" integer NOT NULL,
	"livemode" boolean NOT NULL,
	"max_redemptions" integer,
	"metadata" jsonb,
	"percent_off" integer,
	"times_redeemed" integer NOT NULL,
	"active" boolean
);
