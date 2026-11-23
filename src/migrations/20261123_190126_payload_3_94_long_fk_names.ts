import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gala_noir_performers_performers" DROP CONSTRAINT IF EXISTS "pages_blocks_gala_noir_performers_performers_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_gala_noir_performers_performers" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_gala_noir_performers_performers_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_gala_noir_performers_performers" ADD CONSTRAINT "pages_blocks_gala_noir_performers_performers_image__c32d58f4_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_performers_performers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_performers_performers_ima_98c0bde0_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gala_noir_performers_performers" DROP CONSTRAINT IF EXISTS "pages_blocks_gala_noir_performers_performers_image__c32d58f4_fk";
  
  ALTER TABLE "_pages_v_blocks_gala_noir_performers_performers" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_gala_noir_performers_performers_ima_98c0bde0_fk";
  
  ALTER TABLE "pages_blocks_gala_noir_performers_performers" ADD CONSTRAINT "pages_blocks_gala_noir_performers_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_performers_performers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_performers_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;`)
}
