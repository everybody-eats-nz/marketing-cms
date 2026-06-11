import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_pillars_items" ADD COLUMN "illustration_id" integer;
  ALTER TABLE "_pages_v_blocks_pillars_items" ADD COLUMN "illustration_id" integer;
  ALTER TABLE "locations" ADD COLUMN "illustration_id" integer;
  ALTER TABLE "locations" ADD COLUMN "illustration_white_id" integer;
  ALTER TABLE "_locations_v" ADD COLUMN "version_illustration_id" integer;
  ALTER TABLE "_locations_v" ADD COLUMN "version_illustration_white_id" integer;
  ALTER TABLE "pages_blocks_pillars_items" ADD CONSTRAINT "pages_blocks_pillars_items_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars_items" ADD CONSTRAINT "_pages_v_blocks_pillars_items_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_illustration_white_id_media_id_fk" FOREIGN KEY ("illustration_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_illustration_id_media_id_fk" FOREIGN KEY ("version_illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_illustration_white_id_media_id_fk" FOREIGN KEY ("version_illustration_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_pillars_items_illustration_idx" ON "pages_blocks_pillars_items" USING btree ("illustration_id");
  CREATE INDEX "_pages_v_blocks_pillars_items_illustration_idx" ON "_pages_v_blocks_pillars_items" USING btree ("illustration_id");
  CREATE INDEX "locations_illustration_idx" ON "locations" USING btree ("illustration_id");
  CREATE INDEX "locations_illustration_white_idx" ON "locations" USING btree ("illustration_white_id");
  CREATE INDEX "_locations_v_version_version_illustration_idx" ON "_locations_v" USING btree ("version_illustration_id");
  CREATE INDEX "_locations_v_version_version_illustration_white_idx" ON "_locations_v" USING btree ("version_illustration_white_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_pillars_items" DROP CONSTRAINT "pages_blocks_pillars_items_illustration_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_pillars_items" DROP CONSTRAINT "_pages_v_blocks_pillars_items_illustration_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_illustration_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_illustration_white_id_media_id_fk";
  
  ALTER TABLE "_locations_v" DROP CONSTRAINT "_locations_v_version_illustration_id_media_id_fk";
  
  ALTER TABLE "_locations_v" DROP CONSTRAINT "_locations_v_version_illustration_white_id_media_id_fk";
  
  DROP INDEX "pages_blocks_pillars_items_illustration_idx";
  DROP INDEX "_pages_v_blocks_pillars_items_illustration_idx";
  DROP INDEX "locations_illustration_idx";
  DROP INDEX "locations_illustration_white_idx";
  DROP INDEX "_locations_v_version_version_illustration_idx";
  DROP INDEX "_locations_v_version_version_illustration_white_idx";
  ALTER TABLE "pages_blocks_pillars_items" DROP COLUMN "illustration_id";
  ALTER TABLE "_pages_v_blocks_pillars_items" DROP COLUMN "illustration_id";
  ALTER TABLE "locations" DROP COLUMN "illustration_id";
  ALTER TABLE "locations" DROP COLUMN "illustration_white_id";
  ALTER TABLE "_locations_v" DROP COLUMN "version_illustration_id";
  ALTER TABLE "_locations_v" DROP COLUMN "version_illustration_white_id";`)
}
