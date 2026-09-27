import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "cafe_banner_book_label" varchar DEFAULT 'Book a table';
  ALTER TABLE "site_settings" ADD COLUMN "cafe_banner_toast_booking_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cafe_banner_hopper_booking_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cafe_banner_donate_label" varchar DEFAULT 'Donate';
  ALTER TABLE "site_settings" ADD COLUMN "cafe_banner_donate_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "cafe_banner_book_label";
  ALTER TABLE "site_settings" DROP COLUMN "cafe_banner_toast_booking_url";
  ALTER TABLE "site_settings" DROP COLUMN "cafe_banner_hopper_booking_url";
  ALTER TABLE "site_settings" DROP COLUMN "cafe_banner_donate_label";
  ALTER TABLE "site_settings" DROP COLUMN "cafe_banner_donate_url";`)
}
