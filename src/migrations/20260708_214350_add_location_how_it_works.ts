import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ADD COLUMN "how_it_works_lead" varchar;
  ALTER TABLE "locations" ADD COLUMN "how_it_works_detail" varchar;
  ALTER TABLE "_locations_v" ADD COLUMN "version_how_it_works_lead" varchar;
  ALTER TABLE "_locations_v" ADD COLUMN "version_how_it_works_detail" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DROP COLUMN "how_it_works_lead";
  ALTER TABLE "locations" DROP COLUMN "how_it_works_detail";
  ALTER TABLE "_locations_v" DROP COLUMN "version_how_it_works_lead";
  ALTER TABLE "_locations_v" DROP COLUMN "version_how_it_works_detail";`)
}
