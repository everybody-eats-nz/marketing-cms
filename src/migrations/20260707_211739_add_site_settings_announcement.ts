import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_announcement_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "site_settings" ADD COLUMN "announcement_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_campaign_id" varchar DEFAULT 'hopper-launch';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_eyebrow" varchar DEFAULT 'an everybody eats cafe';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_heading" varchar DEFAULT 'Now open in Te Aro.';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_body" varchar DEFAULT 'Rescued food, accessible prices, and a genuine sense of belonging - a new cafe from the Everybody Eats team.';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_type" "enum_site_settings_announcement_link_type" DEFAULT 'internal';
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_internal_href" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_external_href" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_link_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "announcement_dismiss_label" varchar DEFAULT 'Not now';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "announcement_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_campaign_id";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_heading";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_body";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_label";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_type";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_internal_href";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_external_href";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_link_open_in_new_tab";
  ALTER TABLE "site_settings" DROP COLUMN "announcement_dismiss_label";
  DROP TYPE "public"."enum_site_settings_announcement_link_type";`)
}
