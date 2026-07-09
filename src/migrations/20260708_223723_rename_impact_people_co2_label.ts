import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Rename the impact "people" label column: it now labels the CO₂-saved figure
  // instead of the old "volunteers in the door" count.
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" RENAME COLUMN "people_volunteers_label" TO "people_co2_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" RENAME COLUMN "people_volunteers_label" TO "people_co2_label";`)

  // A rename keeps the old column default, so realign it with the new field
  // default (otherwise the next generated migration diffs the default back).
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ALTER COLUMN "people_co2_label" SET DEFAULT 'kg of CO₂ saved';
  ALTER TABLE "_pages_v_blocks_impact_landing" ALTER COLUMN "people_co2_label" SET DEFAULT 'kg of CO₂ saved';`)

  // Overwrite the stale label on any already-published/drafted impact page so it
  // reads correctly. Editors can re-customise it afterwards.
  await db.execute(sql`
   UPDATE "pages_blocks_impact_landing" SET "people_co2_label" = 'kg of CO₂ saved' WHERE "people_co2_label" IS NULL OR "people_co2_label" = 'volunteers in the door';
  UPDATE "_pages_v_blocks_impact_landing" SET "people_co2_label" = 'kg of CO₂ saved' WHERE "people_co2_label" IS NULL OR "people_co2_label" = 'volunteers in the door';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" RENAME COLUMN "people_co2_label" TO "people_volunteers_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" RENAME COLUMN "people_co2_label" TO "people_volunteers_label";`)

  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ALTER COLUMN "people_volunteers_label" SET DEFAULT 'volunteers in the door';
  ALTER TABLE "_pages_v_blocks_impact_landing" ALTER COLUMN "people_volunteers_label" SET DEFAULT 'volunteers in the door';`)
}
