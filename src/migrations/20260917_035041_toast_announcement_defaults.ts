import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "announcement_campaign_id" SET DEFAULT 'toast-launch';
  ALTER TABLE "site_settings" ALTER COLUMN "announcement_heading" SET DEFAULT 'Now open in Onehunga.';`)

  // The column defaults above only reach rows created from here on, and
  // site_settings is a single long-lived row — so repoint the stored Hopper
  // campaign at Toast too, or the takeover would keep sending visitors to
  // /hopper. Each UPDATE matches the old value exactly, so anything an editor
  // has since customised is left alone.
  await db.execute(sql`
   UPDATE "site_settings" SET "announcement_campaign_id" = 'toast-launch' WHERE "announcement_campaign_id" = 'hopper-launch';
  UPDATE "site_settings" SET "announcement_heading" = 'Now open in Onehunga.' WHERE "announcement_heading" = 'Now open in Te Aro.';
  UPDATE "site_settings" SET "announcement_link_internal_href" = '/toast' WHERE "announcement_link_internal_href" = '/hopper';
  UPDATE "site_settings" SET "announcement_link_label" = 'Visit Toast' WHERE "announcement_link_label" = 'Visit Hopper';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "announcement_campaign_id" SET DEFAULT 'hopper-launch';
  ALTER TABLE "site_settings" ALTER COLUMN "announcement_heading" SET DEFAULT 'Now open in Te Aro.';`)

  await db.execute(sql`
   UPDATE "site_settings" SET "announcement_campaign_id" = 'hopper-launch' WHERE "announcement_campaign_id" = 'toast-launch';
  UPDATE "site_settings" SET "announcement_heading" = 'Now open in Te Aro.' WHERE "announcement_heading" = 'Now open in Onehunga.';
  UPDATE "site_settings" SET "announcement_link_internal_href" = '/hopper' WHERE "announcement_link_internal_href" = '/toast';
  UPDATE "site_settings" SET "announcement_link_label" = 'Visit Hopper' WHERE "announcement_link_label" = 'Visit Toast';`)
}
