import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// NOTE: the generated diff also re-emitted the impact_landing label swap from
// 20260709_025244 (the previous migration's snapshot was cut from a branch that
// predated it). Those statements are already applied in prod, so they're
// stripped here; the snapshot .json keeps the full current schema, which
// re-syncs the chain for future migrations.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "download_id" integer;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "download_label" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "download_id" integer;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "download_label" varchar;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_download_id_documents_id_fk" FOREIGN KEY ("download_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_download_id_documents_id_fk" FOREIGN KEY ("download_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_card_grid_download_idx" ON "pages_blocks_card_grid" USING btree ("download_id");
  CREATE INDEX "_pages_v_blocks_card_grid_download_idx" ON "_pages_v_blocks_card_grid" USING btree ("download_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_grid" DROP CONSTRAINT "pages_blocks_card_grid_download_id_documents_id_fk";

  ALTER TABLE "_pages_v_blocks_card_grid" DROP CONSTRAINT "_pages_v_blocks_card_grid_download_id_documents_id_fk";

  DROP INDEX "pages_blocks_card_grid_download_idx";
  DROP INDEX "_pages_v_blocks_card_grid_download_idx";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "download_id";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "download_label";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "download_id";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "download_label";`)
}
