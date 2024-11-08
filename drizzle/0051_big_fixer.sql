ALTER TABLE "coupons" RENAME COLUMN "amount_off" TO "amountOff";--> statement-breakpoint
ALTER TABLE "coupons" RENAME COLUMN "duration_in_months" TO "durationInMonths";--> statement-breakpoint
ALTER TABLE "coupons" RENAME COLUMN "max_redemptions" TO "maxRedemptions";--> statement-breakpoint
ALTER TABLE "coupons" RENAME COLUMN "percent_off" TO "percentOff";--> statement-breakpoint
ALTER TABLE "coupons" RENAME COLUMN "redeem_by" TO "redeemBy";--> statement-breakpoint
ALTER TABLE "coupons" RENAME COLUMN "times_redeemed" TO "timesRedeemed";--> statement-breakpoint
ALTER TABLE "promotionCodes" RENAME COLUMN "max_redemptions" TO "maxRedemptions";--> statement-breakpoint
ALTER TABLE "promotionCodes" RENAME COLUMN "percent_off" TO "expiresAt";--> statement-breakpoint
ALTER TABLE "promotionCodes" RENAME COLUMN "times_redeemed" TO "timesRedeemed";--> statement-breakpoint
ALTER TABLE "pronunciationsAssessment" DROP CONSTRAINT "pronunciationsAssessment_conversationId_conversations_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pronunciationsAssessment" DROP COLUMN IF EXISTS "conversationId";