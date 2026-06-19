import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "gala_banner_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_label" varchar DEFAULT 'The Everybody Eats Gala';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_event_date" timestamp(3) with time zone DEFAULT '2026-10-30T05:30:00.000Z';
  ALTER TABLE "site_settings" ADD COLUMN "gala_banner_cta_label" varchar DEFAULT 'Book';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "gala_banner_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_label";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_event_date";
  ALTER TABLE "site_settings" DROP COLUMN "gala_banner_cta_label";`)
}
