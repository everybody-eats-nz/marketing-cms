import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cafes_open_status" AS ENUM('open', 'coming-soon', 'closed');
  CREATE TYPE "public"."enum_cafes_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_cafes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cafes_v_version_open_status" AS ENUM('open', 'coming-soon', 'closed');
  CREATE TYPE "public"."enum__cafes_v_version_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__cafes_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_cafes_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cafes_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cafes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"city" varchar,
  	"tagline" varchar,
  	"open_status" "enum_cafes_open_status",
  	"hero_image_id" integer,
  	"link_label" varchar,
  	"link_type" "enum_cafes_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cafes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_cafes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_city" varchar,
  	"version_tagline" varchar,
  	"version_open_status" "enum__cafes_v_version_open_status",
  	"version_hero_image_id" integer,
  	"version_link_label" varchar,
  	"version_link_type" "enum__cafes_v_version_link_type" DEFAULT 'internal',
  	"version_link_internal_href" varchar,
  	"version_link_external_href" varchar,
  	"version_link_open_in_new_tab" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cafes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cafes_id" integer;
  ALTER TABLE "pages_blocks_cafes_row" ADD CONSTRAINT "pages_blocks_cafes_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cafes_row" ADD CONSTRAINT "_pages_v_blocks_cafes_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafes" ADD CONSTRAINT "cafes_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cafes_v" ADD CONSTRAINT "_cafes_v_parent_id_cafes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cafes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cafes_v" ADD CONSTRAINT "_cafes_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cafes_row_order_idx" ON "pages_blocks_cafes_row" USING btree ("_order");
  CREATE INDEX "pages_blocks_cafes_row_parent_id_idx" ON "pages_blocks_cafes_row" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cafes_row_path_idx" ON "pages_blocks_cafes_row" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cafes_row_order_idx" ON "_pages_v_blocks_cafes_row" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cafes_row_parent_id_idx" ON "_pages_v_blocks_cafes_row" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cafes_row_path_idx" ON "_pages_v_blocks_cafes_row" USING btree ("_path");
  CREATE UNIQUE INDEX "cafes_slug_idx" ON "cafes" USING btree ("slug");
  CREATE INDEX "cafes_hero_image_idx" ON "cafes" USING btree ("hero_image_id");
  CREATE INDEX "cafes_updated_at_idx" ON "cafes" USING btree ("updated_at");
  CREATE INDEX "cafes_created_at_idx" ON "cafes" USING btree ("created_at");
  CREATE INDEX "cafes__status_idx" ON "cafes" USING btree ("_status");
  CREATE INDEX "_cafes_v_parent_idx" ON "_cafes_v" USING btree ("parent_id");
  CREATE INDEX "_cafes_v_version_version_slug_idx" ON "_cafes_v" USING btree ("version_slug");
  CREATE INDEX "_cafes_v_version_version_hero_image_idx" ON "_cafes_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_cafes_v_version_version_updated_at_idx" ON "_cafes_v" USING btree ("version_updated_at");
  CREATE INDEX "_cafes_v_version_version_created_at_idx" ON "_cafes_v" USING btree ("version_created_at");
  CREATE INDEX "_cafes_v_version_version__status_idx" ON "_cafes_v" USING btree ("version__status");
  CREATE INDEX "_cafes_v_created_at_idx" ON "_cafes_v" USING btree ("created_at");
  CREATE INDEX "_cafes_v_updated_at_idx" ON "_cafes_v" USING btree ("updated_at");
  CREATE INDEX "_cafes_v_latest_idx" ON "_cafes_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cafes_fk" FOREIGN KEY ("cafes_id") REFERENCES "public"."cafes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_cafes_id_idx" ON "payload_locked_documents_rels" USING btree ("cafes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cafes_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cafes_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cafes_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_cafes_row" CASCADE;
  DROP TABLE "_pages_v_blocks_cafes_row" CASCADE;
  DROP TABLE "cafes" CASCADE;
  DROP TABLE "_cafes_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cafes_fk";
  
  DROP INDEX "payload_locked_documents_rels_cafes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cafes_id";
  DROP TYPE "public"."enum_cafes_open_status";
  DROP TYPE "public"."enum_cafes_link_type";
  DROP TYPE "public"."enum_cafes_status";
  DROP TYPE "public"."enum__cafes_v_version_open_status";
  DROP TYPE "public"."enum__cafes_v_version_link_type";
  DROP TYPE "public"."enum__cafes_v_version_status";`)
}
