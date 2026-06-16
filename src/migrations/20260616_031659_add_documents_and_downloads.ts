import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_downloads_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_downloads_columns" AS ENUM('1', '2', '3');
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"prefix" varchar DEFAULT 'documents',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_downloads_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Download',
  	"heading" varchar,
  	"intro" varchar,
  	"columns" "enum_pages_blocks_downloads_columns" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Download',
  	"heading" varchar,
  	"intro" varchar,
  	"columns" "enum__pages_v_blocks_downloads_columns" DEFAULT '2',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "pages_blocks_downloads_items" ADD CONSTRAINT "pages_blocks_downloads_items_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_items" ADD CONSTRAINT "pages_blocks_downloads_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads" ADD CONSTRAINT "pages_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_items" ADD CONSTRAINT "_pages_v_blocks_downloads_items_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_items" ADD CONSTRAINT "_pages_v_blocks_downloads_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads" ADD CONSTRAINT "_pages_v_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "pages_blocks_downloads_items_order_idx" ON "pages_blocks_downloads_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_items_parent_id_idx" ON "pages_blocks_downloads_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_items_file_idx" ON "pages_blocks_downloads_items" USING btree ("file_id");
  CREATE INDEX "pages_blocks_downloads_order_idx" ON "pages_blocks_downloads" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_parent_id_idx" ON "pages_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_path_idx" ON "pages_blocks_downloads" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_downloads_items_order_idx" ON "_pages_v_blocks_downloads_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_items_parent_id_idx" ON "_pages_v_blocks_downloads_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_items_file_idx" ON "_pages_v_blocks_downloads_items" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_downloads_order_idx" ON "_pages_v_blocks_downloads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_parent_id_idx" ON "_pages_v_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_path_idx" ON "_pages_v_blocks_downloads" USING btree ("_path");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_downloads_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_downloads_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "pages_blocks_downloads_items" CASCADE;
  DROP TABLE "pages_blocks_downloads" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_items" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  DROP TYPE "public"."enum_pages_blocks_downloads_columns";
  DROP TYPE "public"."enum__pages_v_blocks_downloads_columns";`)
}
