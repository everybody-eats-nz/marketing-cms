import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_enquiry_form_variant" AS ENUM('forest', 'cream');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_variant" AS ENUM('forest', 'cream');
  CREATE TABLE "pages_blocks_enquiry_form_enquiry_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_enquiry_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Start an enquiry',
  	"heading" varchar DEFAULT 'Let''s plan something
  *worth sharing*.',
  	"intro" varchar,
  	"variant" "enum_pages_blocks_enquiry_form_variant" DEFAULT 'forest',
  	"recipient_email" varchar,
  	"success_message" varchar DEFAULT 'Thanks — your enquiry is on its way. We''ll be in touch within two working *days*.',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_enquiry_form_enquiry_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_enquiry_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Start an enquiry',
  	"heading" varchar DEFAULT 'Let''s plan something
  *worth sharing*.',
  	"intro" varchar,
  	"variant" "enum__pages_v_blocks_enquiry_form_variant" DEFAULT 'forest',
  	"recipient_email" varchar,
  	"success_message" varchar DEFAULT 'Thanks — your enquiry is on its way. We''ll be in touch within two working *days*.',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "corporate_email" varchar;
  ALTER TABLE "pages_blocks_enquiry_form_enquiry_types" ADD CONSTRAINT "pages_blocks_enquiry_form_enquiry_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_enquiry_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_enquiry_form" ADD CONSTRAINT "pages_blocks_enquiry_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_enquiry_form_enquiry_types" ADD CONSTRAINT "_pages_v_blocks_enquiry_form_enquiry_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_enquiry_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_enquiry_form" ADD CONSTRAINT "_pages_v_blocks_enquiry_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_enquiry_form_enquiry_types_order_idx" ON "pages_blocks_enquiry_form_enquiry_types" USING btree ("_order");
  CREATE INDEX "pages_blocks_enquiry_form_enquiry_types_parent_id_idx" ON "pages_blocks_enquiry_form_enquiry_types" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_enquiry_form_order_idx" ON "pages_blocks_enquiry_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_enquiry_form_parent_id_idx" ON "pages_blocks_enquiry_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_enquiry_form_path_idx" ON "pages_blocks_enquiry_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_enquiry_form_enquiry_types_order_idx" ON "_pages_v_blocks_enquiry_form_enquiry_types" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_enquiry_form_enquiry_types_parent_id_idx" ON "_pages_v_blocks_enquiry_form_enquiry_types" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_enquiry_form_order_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_enquiry_form_parent_id_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_enquiry_form_path_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_enquiry_form_enquiry_types" CASCADE;
  DROP TABLE "pages_blocks_enquiry_form" CASCADE;
  DROP TABLE "_pages_v_blocks_enquiry_form_enquiry_types" CASCADE;
  DROP TABLE "_pages_v_blocks_enquiry_form" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "corporate_email";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_variant";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_variant";`)
}
