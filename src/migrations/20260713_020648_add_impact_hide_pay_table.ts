import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "hide_pay_table" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "hide_pay_table" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "hide_pay_table";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "hide_pay_table";`)
}
