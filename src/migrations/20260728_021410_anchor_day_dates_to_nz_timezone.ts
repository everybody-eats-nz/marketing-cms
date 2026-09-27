import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_closures_date_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_locations_closures_enddate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum__locations_v_version_closures_date_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum__locations_v_version_closures_enddate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_journal_posts_publishedat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum__journal_posts_v_version_publishedat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "locations_closures" ADD COLUMN "date_tz" "enum_locations_closures_date_tz" DEFAULT 'Pacific/Auckland';
  ALTER TABLE "locations_closures" ADD COLUMN "enddate_tz" "enum_locations_closures_enddate_tz" DEFAULT 'Pacific/Auckland';
  ALTER TABLE "_locations_v_version_closures" ADD COLUMN "date_tz" "enum__locations_v_version_closures_date_tz" DEFAULT 'Pacific/Auckland';
  ALTER TABLE "_locations_v_version_closures" ADD COLUMN "enddate_tz" "enum__locations_v_version_closures_enddate_tz" DEFAULT 'Pacific/Auckland';
  ALTER TABLE "journal_posts" ADD COLUMN "publishedat_tz" "enum_journal_posts_publishedat_tz" DEFAULT 'Pacific/Auckland';
  ALTER TABLE "_journal_posts_v" ADD COLUMN "version_publishedat_tz" "enum__journal_posts_v_version_publishedat_tz" DEFAULT 'Pacific/Auckland';`)

  // Re-anchor the day-only dates already in the database. They were written by
  // Payload's picker as 12:00 UTC on the chosen day, which in Auckland is
  // already midnight the NEXT day - so with the timezone columns above now in
  // play the admin would keep redisplaying them a day late. Truncating to
  // midnight UTC puts them at midday in Auckland on the same day, which is what
  // a fresh pick now stores.
  //
  // The UTC calendar day is unchanged by this, and that is what the frontend
  // reads (see pickedDay() in src/lib/closures.ts), so nothing the public site
  // renders moves.
  await db.execute(sql`
   UPDATE "locations_closures" SET "date" = date_trunc('day', "date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' WHERE "date" IS NOT NULL;
  UPDATE "locations_closures" SET "end_date" = date_trunc('day', "end_date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' WHERE "end_date" IS NOT NULL;
  UPDATE "_locations_v_version_closures" SET "date" = date_trunc('day', "date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' WHERE "date" IS NOT NULL;
  UPDATE "_locations_v_version_closures" SET "end_date" = date_trunc('day', "end_date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' WHERE "end_date" IS NOT NULL;
  UPDATE "journal_posts" SET "published_at" = date_trunc('day', "published_at" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' WHERE "published_at" IS NOT NULL;
  UPDATE "_journal_posts_v" SET "version_published_at" = date_trunc('day', "version_published_at" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' WHERE "version_published_at" IS NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Put the day-only dates back on 12:00 UTC, where Payload's picker writes
  // them without a timezone anchor. Same calendar day either way, so this is
  // only about matching what the pre-migration code expects to find.
  await db.execute(sql`
   UPDATE "locations_closures" SET "date" = date_trunc('day', "date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + interval '12 hours' WHERE "date" IS NOT NULL;
  UPDATE "locations_closures" SET "end_date" = date_trunc('day', "end_date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + interval '12 hours' WHERE "end_date" IS NOT NULL;
  UPDATE "_locations_v_version_closures" SET "date" = date_trunc('day', "date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + interval '12 hours' WHERE "date" IS NOT NULL;
  UPDATE "_locations_v_version_closures" SET "end_date" = date_trunc('day', "end_date" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + interval '12 hours' WHERE "end_date" IS NOT NULL;
  UPDATE "journal_posts" SET "published_at" = date_trunc('day', "published_at" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + interval '12 hours' WHERE "published_at" IS NOT NULL;
  UPDATE "_journal_posts_v" SET "version_published_at" = date_trunc('day', "version_published_at" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + interval '12 hours' WHERE "version_published_at" IS NOT NULL;`)

  await db.execute(sql`
   ALTER TABLE "locations_closures" DROP COLUMN "date_tz";
  ALTER TABLE "locations_closures" DROP COLUMN "enddate_tz";
  ALTER TABLE "_locations_v_version_closures" DROP COLUMN "date_tz";
  ALTER TABLE "_locations_v_version_closures" DROP COLUMN "enddate_tz";
  ALTER TABLE "journal_posts" DROP COLUMN "publishedat_tz";
  ALTER TABLE "_journal_posts_v" DROP COLUMN "version_publishedat_tz";
  DROP TYPE "public"."enum_locations_closures_date_tz";
  DROP TYPE "public"."enum_locations_closures_enddate_tz";
  DROP TYPE "public"."enum__locations_v_version_closures_date_tz";
  DROP TYPE "public"."enum__locations_v_version_closures_enddate_tz";
  DROP TYPE "public"."enum_journal_posts_publishedat_tz";
  DROP TYPE "public"."enum__journal_posts_v_version_publishedat_tz";`)
}
