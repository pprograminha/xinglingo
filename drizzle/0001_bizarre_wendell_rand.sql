CREATE TABLE IF NOT EXISTS "phonemes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"phoneme" text NOT NULL,
	"wordId" uuid NOT NULL,
	"accuracyScore" double precision NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pronunciationAssessment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text,
	"conversationId" uuid,
	"accuracyScore" double precision NOT NULL,
	"completenessScore" double precision NOT NULL,
	"fluencyScore" double precision NOT NULL,
	"pronScore" double precision NOT NULL,
	"prosodyScore" double precision NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "words" (
	"id" uuid PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"accuracyScore" double precision NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phonemes" ADD CONSTRAINT "phonemes_wordId_words_id_fk" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
