DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('superadmin', 'admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."client" AS ENUM('cloudflare-s3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"authorId" uuid,
	"role" "role" DEFAULT 'user' NOT NULL,
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
	"creatorId" uuid,
	"accuracyScore" double precision NOT NULL,
	"completenessScore" double precision NOT NULL,
	"fluencyScore" double precision NOT NULL,
	"pronScore" double precision NOT NULL,
	"prosodyScore" double precision NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speechs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"speech" text NOT NULL,
	"voice" text NOT NULL,
	"speed" double precision DEFAULT 1 NOT NULL,
	"client" "client" DEFAULT 'cloudflare-s3' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speechsToConversations" (
	"speechId" uuid NOT NULL,
	"conversationId" uuid NOT NULL,
	CONSTRAINT "speechsToConversations_speechId_conversationId_pk" PRIMARY KEY("speechId","conversationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullName" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"locale" text DEFAULT 'pt' NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_image_unique" UNIQUE("image")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersAvailability" (
	"id" uuid PRIMARY KEY NOT NULL,
	"times" jsonb[9] NOT NULL,
	"days" jsonb[7] NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersProfile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"communicationLevel" text DEFAULT 'basics' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usersProfile_userId_unique" UNIQUE("userId")
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
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phonemes" ADD CONSTRAINT "phonemes_wordId_words_id_fk" FOREIGN KEY ("wordId") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pronunciationsAssessment" ADD CONSTRAINT "pronunciationsAssessment_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pronunciationsAssessment" ADD CONSTRAINT "pronunciationsAssessment_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speechsToConversations" ADD CONSTRAINT "speechsToConversations_speechId_speechs_id_fk" FOREIGN KEY ("speechId") REFERENCES "public"."speechs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speechsToConversations" ADD CONSTRAINT "speechsToConversations_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersProfile" ADD CONSTRAINT "usersProfile_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "words" ADD CONSTRAINT "words_pronunciationAssessmentId_pronunciationsAssessment_id_fk" FOREIGN KEY ("pronunciationAssessmentId") REFERENCES "public"."pronunciationsAssessment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
