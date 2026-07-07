import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta_strip" ADD COLUMN "tertiary_cta_label" varchar;
  ALTER TABLE "pages_blocks_cta_strip" ADD COLUMN "tertiary_cta_href" varchar;
  ALTER TABLE "_pages_v_blocks_cta_strip" ADD COLUMN "tertiary_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_strip" ADD COLUMN "tertiary_cta_href" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta_strip" DROP COLUMN "tertiary_cta_label";
  ALTER TABLE "pages_blocks_cta_strip" DROP COLUMN "tertiary_cta_href";
  ALTER TABLE "_pages_v_blocks_cta_strip" DROP COLUMN "tertiary_cta_label";
  ALTER TABLE "_pages_v_blocks_cta_strip" DROP COLUMN "tertiary_cta_href";`)
}
