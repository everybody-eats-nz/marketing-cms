import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_stats_items_live_metric" AS ENUM('none', 'peopleServed', 'volunteerHours', 'foodSavedKg');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_items_live_metric" AS ENUM('none', 'peopleServed', 'volunteerHours', 'foodSavedKg');
  CREATE TYPE "public"."enum_site_settings_stats_live_metric" AS ENUM('none', 'peopleServed', 'volunteerHours', 'foodSavedKg');
  ALTER TABLE "pages_blocks_stats_items" ADD COLUMN "live_metric" "enum_pages_blocks_stats_items_live_metric" DEFAULT 'none';
  ALTER TABLE "pages_blocks_stats_items" ADD COLUMN "suffix" varchar;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD COLUMN "live_metric" "enum__pages_v_blocks_stats_items_live_metric" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_stats_items" ADD COLUMN "suffix" varchar;
  ALTER TABLE "site_settings_stats" ADD COLUMN "live_metric" "enum_site_settings_stats_live_metric" DEFAULT 'none';
  ALTER TABLE "site_settings_stats" ADD COLUMN "suffix" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_stats_items" DROP COLUMN "live_metric";
  ALTER TABLE "pages_blocks_stats_items" DROP COLUMN "suffix";
  ALTER TABLE "_pages_v_blocks_stats_items" DROP COLUMN "live_metric";
  ALTER TABLE "_pages_v_blocks_stats_items" DROP COLUMN "suffix";
  ALTER TABLE "site_settings_stats" DROP COLUMN "live_metric";
  ALTER TABLE "site_settings_stats" DROP COLUMN "suffix";
  DROP TYPE "public"."enum_pages_blocks_stats_items_live_metric";
  DROP TYPE "public"."enum__pages_v_blocks_stats_items_live_metric";
  DROP TYPE "public"."enum_site_settings_stats_live_metric";`)
}
