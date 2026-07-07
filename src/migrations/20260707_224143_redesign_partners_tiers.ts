import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Partners-only migration. migrate:create also re-emitted the site_settings
// announcement columns because main's cta_strip migration carries a snapshot
// from before the announcement migration landed; those columns already exist
// (added by 20260707_211739_add_site_settings_announcement), so re-adding them
// here would fail on any DB that ran that migration. They are dropped from the
// SQL below — the paired .json snapshot still records the full schema, which
// realigns the snapshot baseline going forward.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_friend_category" AS ENUM('food-hospitality', 'community', 'business');
  ALTER TABLE "partners" ALTER COLUMN "tier" SET DATA TYPE text;
  -- Remap the legacy Webflow tiers onto the new three-tier taxonomy before the
  -- enum is recreated, so the cast on existing rows can't fail. The partners
  -- seed re-classifies every record afterwards; this only needs to be valid.
  UPDATE "partners" SET "tier" = 'major' WHERE "tier" IN ('platinum', 'gold');
  UPDATE "partners" SET "tier" = 'supporting' WHERE "tier" NOT IN ('major', 'friend');
  DROP TYPE "public"."enum_partners_tier";
  CREATE TYPE "public"."enum_partners_tier" AS ENUM('major', 'supporting', 'friend');
  ALTER TABLE "partners" ALTER COLUMN "tier" SET DATA TYPE "public"."enum_partners_tier" USING "tier"::"public"."enum_partners_tier";
  ALTER TABLE "pages_blocks_partners_grid" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_partners_grid" ADD COLUMN "intro" varchar;
  ALTER TABLE "partners" ADD COLUMN "friend_category" "enum_partners_friend_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" ALTER COLUMN "tier" SET DATA TYPE text;
  -- Fold the new tiers back onto the legacy set so the reverse cast can't fail.
  UPDATE "partners" SET "tier" = 'platinum' WHERE "tier" = 'major';
  UPDATE "partners" SET "tier" = 'supporting' WHERE "tier" NOT IN ('platinum', 'gold', 'funding', 'supporting', 'hospitality', 'food');
  DROP TYPE "public"."enum_partners_tier";
  CREATE TYPE "public"."enum_partners_tier" AS ENUM('platinum', 'gold', 'funding', 'supporting', 'hospitality', 'food');
  ALTER TABLE "partners" ALTER COLUMN "tier" SET DATA TYPE "public"."enum_partners_tier" USING "tier"::"public"."enum_partners_tier";
  ALTER TABLE "pages_blocks_partners_grid" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_partners_grid" DROP COLUMN "intro";
  ALTER TABLE "partners" DROP COLUMN "friend_category";
  DROP TYPE "public"."enum_partners_friend_category";`)
}
