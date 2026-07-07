import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ALTER COLUMN "open_status" DROP DEFAULT;
  ALTER TABLE "_locations_v" ALTER COLUMN "version_open_status" DROP DEFAULT;
  ALTER TABLE "locations" ADD COLUMN "menu_location_name" varchar;
  ALTER TABLE "_locations_v" ADD COLUMN "version_menu_location_name" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ALTER COLUMN "open_status" SET DEFAULT 'open';
  ALTER TABLE "_locations_v" ALTER COLUMN "version_open_status" SET DEFAULT 'open';
  ALTER TABLE "locations" DROP COLUMN "menu_location_name";
  ALTER TABLE "_locations_v" DROP COLUMN "version_menu_location_name";`)
}
