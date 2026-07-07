import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "announcement_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_campaign_id" varchar DEFAULT 'hopper-launch';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_eyebrow" varchar DEFAULT 'an everybody eats cafe';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_wordmark" varchar DEFAULT 'hOPPer';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_heading" varchar DEFAULT 'Now open in Te Aro.';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_body" varchar DEFAULT 'Rescued food, accessible prices, and a genuine sense of belonging - a new cafe from the Everybody Eats team.';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_cta_label" varchar DEFAULT 'Visit Hopper';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_cta_href" varchar DEFAULT '/hopper';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_dismiss_label" varchar DEFAULT 'Not now';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "announcement_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_campaign_id";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_wordmark";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_heading";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_body";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_cta_label";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_cta_href";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_dismiss_label";`)
}
