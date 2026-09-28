import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload 3.90 (PR #229 dependency bump) added two hidden fields without a
// migration, which took prod down: `_objectKey` on every upload collection
// (plugin-cloud-storage) and `resetPasswordRequestedAt` on auth collections
// (payload core). Guarded with IF [NOT] EXISTS so a manual hotfix applied
// straight to prod doesn't make this migration fail on deploy.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "_objectkey";`)
}
