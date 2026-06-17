import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_donations_status" AS ENUM('succeeded', 'pending', 'failed');
  CREATE TYPE "public"."enum_feedback_sentiment" AS ENUM('positive', 'neutral', 'negative', 'unknown');
  CREATE TYPE "public"."enum_feedback_status" AS ENUM('published', 'hidden', 'pending');
  CREATE TYPE "public"."enum_feedback_source" AS ENUM('pay-flow', 'standalone');
  CREATE TABLE "donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stripe_payment_intent_id" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'nzd',
  	"status" "enum_donations_status" DEFAULT 'succeeded' NOT NULL,
  	"location_slug" varchar,
  	"location_name" varchar,
  	"email" varchar,
  	"receipt_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "feedback" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" varchar NOT NULL,
  	"name" varchar,
  	"rating" numeric,
  	"consent_to_display" boolean DEFAULT false,
  	"sentiment" "enum_feedback_sentiment" DEFAULT 'unknown',
  	"sentiment_reason" varchar,
  	"status" "enum_feedback_status" DEFAULT 'pending' NOT NULL,
  	"location_slug" varchar,
  	"location_name" varchar,
  	"stripe_payment_intent_id" varchar,
  	"source" "enum_feedback_source" DEFAULT 'pay-flow',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "donations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "feedback_id" integer;
  CREATE UNIQUE INDEX "donations_stripe_payment_intent_id_idx" ON "donations" USING btree ("stripe_payment_intent_id");
  CREATE INDEX "donations_location_slug_idx" ON "donations" USING btree ("location_slug");
  CREATE INDEX "donations_updated_at_idx" ON "donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");
  CREATE INDEX "feedback_location_slug_idx" ON "feedback" USING btree ("location_slug");
  CREATE INDEX "feedback_stripe_payment_intent_id_idx" ON "feedback" USING btree ("stripe_payment_intent_id");
  CREATE INDEX "feedback_updated_at_idx" ON "feedback" USING btree ("updated_at");
  CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload_locked_documents_rels" USING btree ("donations_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "feedback" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "donations" CASCADE;
  DROP TABLE "feedback" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_donations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_feedback_fk";
  
  DROP INDEX "payload_locked_documents_rels_donations_id_idx";
  DROP INDEX "payload_locked_documents_rels_feedback_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "donations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "feedback_id";
  DROP TYPE "public"."enum_donations_status";
  DROP TYPE "public"."enum_feedback_sentiment";
  DROP TYPE "public"."enum_feedback_status";
  DROP TYPE "public"."enum_feedback_source";`)
}
