import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ALTER COLUMN "footer_note" SET DEFAULT 'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Left a koha” and “needed a koha” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.';
  ALTER TABLE "_pages_v_blocks_impact_landing" ALTER COLUMN "footer_note" SET DEFAULT 'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Left a koha” and “needed a koha” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.';
  ALTER TABLE "locations" ADD COLUMN "show_in_main_grids" boolean DEFAULT false;
  ALTER TABLE "_locations_v" ADD COLUMN "version_show_in_main_grids" boolean DEFAULT false;
  UPDATE "locations" SET "show_in_main_grids" = true WHERE "slug" IN ('onehunga', 'wellington', 'glen-innes');
  UPDATE "_locations_v" SET "version_show_in_main_grids" = true WHERE "parent_id" IN (SELECT "id" FROM "locations" WHERE "slug" IN ('onehunga', 'wellington', 'glen-innes'));`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_impact_landing" ALTER COLUMN "footer_note" SET DEFAULT 'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Paid it forward” and “ate as our guests” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.';
  ALTER TABLE "_pages_v_blocks_impact_landing" ALTER COLUMN "footer_note" SET DEFAULT 'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Paid it forward” and “ate as our guests” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.';
  ALTER TABLE "locations" DROP COLUMN "show_in_main_grids";
  ALTER TABLE "_locations_v" DROP COLUMN "version_show_in_main_grids";`)
}
