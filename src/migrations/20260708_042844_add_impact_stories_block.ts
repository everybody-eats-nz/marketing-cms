import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_impact_landing_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"kicker" varchar DEFAULT 'Story',
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar DEFAULT 'Read the story',
  	"href" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_impact_landing_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"kicker" varchar DEFAULT 'Story',
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar DEFAULT 'Read the story',
  	"href" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_impact_landing_stories" ADD CONSTRAINT "pages_blocks_impact_landing_stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_impact_landing_stories" ADD CONSTRAINT "pages_blocks_impact_landing_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_impact_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_impact_landing_stories" ADD CONSTRAINT "_pages_v_blocks_impact_landing_stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_impact_landing_stories" ADD CONSTRAINT "_pages_v_blocks_impact_landing_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_impact_landing"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_impact_landing_stories_order_idx" ON "pages_blocks_impact_landing_stories" USING btree ("_order");
  CREATE INDEX "pages_blocks_impact_landing_stories_parent_id_idx" ON "pages_blocks_impact_landing_stories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_impact_landing_stories_image_idx" ON "pages_blocks_impact_landing_stories" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_impact_landing_stories_order_idx" ON "_pages_v_blocks_impact_landing_stories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_impact_landing_stories_parent_id_idx" ON "_pages_v_blocks_impact_landing_stories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_impact_landing_stories_image_idx" ON "_pages_v_blocks_impact_landing_stories" USING btree ("image_id");
  ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "stat_koha_label";
  ALTER TABLE "pages_blocks_impact_landing" DROP COLUMN "people_guests_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "stat_koha_label";
  ALTER TABLE "_pages_v_blocks_impact_landing" DROP COLUMN "people_guests_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_impact_landing_stories" CASCADE;
  DROP TABLE "_pages_v_blocks_impact_landing_stories" CASCADE;
  ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "stat_koha_label" varchar DEFAULT 'given back in koha';
  ALTER TABLE "pages_blocks_impact_landing" ADD COLUMN "people_guests_label" varchar DEFAULT 'ate as our guests';
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "stat_koha_label" varchar DEFAULT 'given back in koha';
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD COLUMN "people_guests_label" varchar DEFAULT 'ate as our guests';`)
}
