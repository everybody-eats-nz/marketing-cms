import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "stat_co2_label" varchar DEFAULT 'kg of CO₂ saved';
  ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "people_volunteers_label" varchar DEFAULT 'volunteers in the door';
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "stat_co2_label" varchar DEFAULT 'kg of CO₂ saved';
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "people_volunteers_label" varchar DEFAULT 'volunteers in the door';
  ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "stat_volunteers_label";
  ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "people_co2_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "stat_volunteers_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "people_co2_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "stat_volunteers_label" varchar DEFAULT 'volunteers welcomed';
  ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "people_co2_label" varchar DEFAULT 'kg of CO₂ saved';
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "stat_volunteers_label" varchar DEFAULT 'volunteers welcomed';
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "people_co2_label" varchar DEFAULT 'kg of CO₂ saved';
  ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "stat_co2_label";
  ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "people_volunteers_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "stat_co2_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "people_volunteers_label";`)
}
