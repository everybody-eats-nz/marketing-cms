import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pay_settings" ADD COLUMN "newsletter_heading" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_subtitle" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_region_label" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_auckland_label" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_wellington_label" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_email_placeholder" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_submit_label" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_sending_label" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_region_error" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_error_message" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_success_title" varchar;
  ALTER TABLE "pay_settings" ADD COLUMN "newsletter_success_message" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pay_settings" DROP COLUMN "newsletter_heading";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_subtitle";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_region_label";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_auckland_label";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_wellington_label";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_email_placeholder";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_submit_label";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_sending_label";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_region_error";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_error_message";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_success_title";
  ALTER TABLE "pay_settings" DROP COLUMN "newsletter_success_message";`)
}
