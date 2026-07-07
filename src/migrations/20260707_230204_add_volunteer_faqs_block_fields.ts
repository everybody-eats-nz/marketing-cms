import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_faqs_accordion_category" AS ENUM('pay-as-you-feel', 'about-us', 'dining', 'volunteering', 'donating', 'our-meals', 'events', 'volunteer-shifts');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_accordion_category" AS ENUM('pay-as-you-feel', 'about-us', 'dining', 'volunteering', 'donating', 'our-meals', 'events', 'volunteer-shifts');
  ALTER TYPE "public"."enum_faqs_category" ADD VALUE 'volunteer-shifts';
  ALTER TABLE "pages_blocks_faqs_accordion" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_faqs_accordion" ADD COLUMN "category" "enum_pages_blocks_faqs_accordion_category";
  ALTER TABLE "_pages_v_blocks_faqs_accordion" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_faqs_accordion" ADD COLUMN "category" "enum__pages_v_blocks_faqs_accordion_category";
  ALTER TABLE "pages_blocks_faqs_accordion" DROP COLUMN "caption";
  ALTER TABLE "_pages_v_blocks_faqs_accordion" DROP COLUMN "caption";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_faqs_category";
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('pay-as-you-feel', 'about-us', 'dining', 'volunteering', 'donating', 'our-meals', 'events');
  ALTER TABLE "faqs" ALTER COLUMN "category" SET DATA TYPE "public"."enum_faqs_category" USING "category"::"public"."enum_faqs_category";
  ALTER TABLE "pages_blocks_faqs_accordion" ADD COLUMN "caption" varchar;
  ALTER TABLE "_pages_v_blocks_faqs_accordion" ADD COLUMN "caption" varchar;
  ALTER TABLE "pages_blocks_faqs_accordion" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_faqs_accordion" DROP COLUMN "category";
  ALTER TABLE "_pages_v_blocks_faqs_accordion" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_faqs_accordion" DROP COLUMN "category";
  DROP TYPE "public"."enum_pages_blocks_faqs_accordion_category";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_accordion_category";`)
}
