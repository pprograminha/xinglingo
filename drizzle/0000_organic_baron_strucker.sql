CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"authorId" uuid,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phonemes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"phoneme" text NOT NULL,
	"wordId" uuid NOT NULL,
	"accuracyScore" double precision NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pronunciationsAssessment" (
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
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullName" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "words" (
	"id" uuid PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"pronunciationAssessmentId" uuid NOT NULL,
	"accuracyScore" double precision NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phonemes" ADD CONSTRAINT "phonemes_wordId_words_id_fk" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pronunciationsAssessment" ADD CONSTRAINT "pronunciationsAssessment_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "words" ADD CONSTRAINT "words_pronunciationAssessmentId_pronunciationsAssessment_id_fk" FOREIGN KEY ("pronunciationAssessmentId") REFERENCES "pronunciationsAssessment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
