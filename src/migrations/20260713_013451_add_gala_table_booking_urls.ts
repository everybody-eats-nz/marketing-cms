import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gala_noir_table" ADD COLUMN "cta_url" varchar DEFAULT '';
  ALTER TABLE "pages_blocks_gala_noir_table" ADD COLUMN "secondary_cta_url" varchar DEFAULT '';
  ALTER TABLE "_pages_v_blocks_gala_noir_table" ADD COLUMN "cta_url" varchar DEFAULT '';
  ALTER TABLE "_pages_v_blocks_gala_noir_table" ADD COLUMN "secondary_cta_url" varchar DEFAULT '';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gala_noir_table" DROP COLUMN "cta_url";
  ALTER TABLE "pages_blocks_gala_noir_table" DROP COLUMN "secondary_cta_url";
  ALTER TABLE "_pages_v_blocks_gala_noir_table" DROP COLUMN "cta_url";
  ALTER TABLE "_pages_v_blocks_gala_noir_table" DROP COLUMN "secondary_cta_url";`)
}
