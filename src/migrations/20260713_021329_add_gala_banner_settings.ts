import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_gala_banner_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_target_date" timestamp(3) with time zone DEFAULT '2026-10-30T05:30:00.000Z';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_event_name" varchar DEFAULT 'The Everybody Eats Gala';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_event_name_short" varchar DEFAULT 'EE Gala';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_date_label" varchar DEFAULT 'Fri 30 Oct 2026';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_link_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_link_type" "enum_site_settings_gala_banner_link_type" DEFAULT 'internal';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_link_internal_href" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_link_external_href" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_link_open_in_new_tab" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "gala_banner_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_target_date";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_event_name";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_event_name_short";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_date_label";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_link_label";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_link_type";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_link_internal_href";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_link_external_href";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_link_open_in_new_tab";
  DROP TYPE "public"."enum_site_settings_gala_banner_link_type";`)
}
