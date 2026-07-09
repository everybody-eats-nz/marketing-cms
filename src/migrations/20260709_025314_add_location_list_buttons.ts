import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ADD COLUMN "list_buttons_visit_label" varchar;
  ALTER TABLE "locations" ADD COLUMN "list_buttons_visit_href" varchar;
  ALTER TABLE "locations" ADD COLUMN "list_buttons_book_label" varchar;
  ALTER TABLE "_locations_v" ADD COLUMN "version_list_buttons_visit_label" varchar;
  ALTER TABLE "_locations_v" ADD COLUMN "version_list_buttons_visit_href" varchar;
  ALTER TABLE "_locations_v" ADD COLUMN "version_list_buttons_book_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DROP COLUMN "list_buttons_visit_label";
  ALTER TABLE "locations" DROP COLUMN "list_buttons_visit_href";
  ALTER TABLE "locations" DROP COLUMN "list_buttons_book_label";
  ALTER TABLE "_locations_v" DROP COLUMN "version_list_buttons_visit_label";
  ALTER TABLE "_locations_v" DROP COLUMN "version_list_buttons_visit_href";
  ALTER TABLE "_locations_v" DROP COLUMN "version_list_buttons_book_label";`)
}
