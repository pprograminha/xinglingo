ALTER TABLE "words" ADD COLUMN "pronunciationAssessmentId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "words" ADD CONSTRAINT "words_pronunciationAssessmentId_pronunciationsAssessment_id_fk" FOREIGN KEY ("pronunciationAssessmentId") REFERENCES "pronunciationsAssessment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
