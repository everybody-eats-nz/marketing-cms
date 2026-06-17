import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "_verified" boolean;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "_verification_token" varchar;`)

  // Mark all pre-existing accounts as verified. Payload only treats `_verified = true`
  // as verified, so without this backfill every current user (created before verification
  // existed) would be locked out on their next login.
  await db.execute(sql`UPDATE "users" SET "_verified" = true WHERE "_verified" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "_verified";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "_verification_token";`)
}
