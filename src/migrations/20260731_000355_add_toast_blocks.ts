import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_toast_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'an everybody eats cafe',
  	"kicker_href" varchar DEFAULT '/',
  	"label" varchar DEFAULT 'pop-up community cafe',
  	"address_line" varchar,
  	"hours_line" varchar DEFAULT 'Fri 7.30–2.30 · Sat + Sun 8.30–2.30',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_toast_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"aside_image_id" integer,
  	"aside_label" varchar,
  	"aside_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_toast_menu_sheets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "pages_blocks_toast_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'The menu',
  	"pdf_id" integer,
  	"download_label" varchar DEFAULT 'Download the menu (PDF)',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_toast_visit_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar,
  	"times" varchar
  );
  
  CREATE TABLE "pages_blocks_toast_visit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Find us',
  	"address" varchar,
  	"note" varchar,
  	"map_label" varchar DEFAULT 'Open in maps ↗',
  	"map_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_toast_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'an everybody eats cafe',
  	"kicker_href" varchar DEFAULT '/',
  	"label" varchar DEFAULT 'pop-up community cafe',
  	"address_line" varchar,
  	"hours_line" varchar DEFAULT 'Fri 7.30–2.30 · Sat + Sun 8.30–2.30',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_toast_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"aside_image_id" integer,
  	"aside_label" varchar,
  	"aside_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_toast_menu_sheets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_toast_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'The menu',
  	"pdf_id" integer,
  	"download_label" varchar DEFAULT 'Download the menu (PDF)',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_toast_visit_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"days" varchar,
  	"times" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_toast_visit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Find us',
  	"address" varchar,
  	"note" varchar,
  	"map_label" varchar DEFAULT 'Open in maps ↗',
  	"map_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_toast_hero" ADD CONSTRAINT "pages_blocks_toast_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_statement" ADD CONSTRAINT "pages_blocks_toast_statement_aside_image_id_media_id_fk" FOREIGN KEY ("aside_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_statement" ADD CONSTRAINT "pages_blocks_toast_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_menu_sheets" ADD CONSTRAINT "pages_blocks_toast_menu_sheets_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_menu_sheets" ADD CONSTRAINT "pages_blocks_toast_menu_sheets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_toast_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_menu" ADD CONSTRAINT "pages_blocks_toast_menu_pdf_id_documents_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_menu" ADD CONSTRAINT "pages_blocks_toast_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_visit_hours" ADD CONSTRAINT "pages_blocks_toast_visit_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_toast_visit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_toast_visit" ADD CONSTRAINT "pages_blocks_toast_visit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_hero" ADD CONSTRAINT "_pages_v_blocks_toast_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_statement" ADD CONSTRAINT "_pages_v_blocks_toast_statement_aside_image_id_media_id_fk" FOREIGN KEY ("aside_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_statement" ADD CONSTRAINT "_pages_v_blocks_toast_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_menu_sheets" ADD CONSTRAINT "_pages_v_blocks_toast_menu_sheets_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_menu_sheets" ADD CONSTRAINT "_pages_v_blocks_toast_menu_sheets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_toast_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_menu" ADD CONSTRAINT "_pages_v_blocks_toast_menu_pdf_id_documents_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_menu" ADD CONSTRAINT "_pages_v_blocks_toast_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_visit_hours" ADD CONSTRAINT "_pages_v_blocks_toast_visit_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_toast_visit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_toast_visit" ADD CONSTRAINT "_pages_v_blocks_toast_visit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_toast_hero_order_idx" ON "pages_blocks_toast_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_toast_hero_parent_id_idx" ON "pages_blocks_toast_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toast_hero_path_idx" ON "pages_blocks_toast_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_toast_statement_order_idx" ON "pages_blocks_toast_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_toast_statement_parent_id_idx" ON "pages_blocks_toast_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toast_statement_path_idx" ON "pages_blocks_toast_statement" USING btree ("_path");
  CREATE INDEX "pages_blocks_toast_statement_aside_aside_image_idx" ON "pages_blocks_toast_statement" USING btree ("aside_image_id");
  CREATE INDEX "pages_blocks_toast_menu_sheets_order_idx" ON "pages_blocks_toast_menu_sheets" USING btree ("_order");
  CREATE INDEX "pages_blocks_toast_menu_sheets_parent_id_idx" ON "pages_blocks_toast_menu_sheets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toast_menu_sheets_image_idx" ON "pages_blocks_toast_menu_sheets" USING btree ("image_id");
  CREATE INDEX "pages_blocks_toast_menu_order_idx" ON "pages_blocks_toast_menu" USING btree ("_order");
  CREATE INDEX "pages_blocks_toast_menu_parent_id_idx" ON "pages_blocks_toast_menu" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toast_menu_path_idx" ON "pages_blocks_toast_menu" USING btree ("_path");
  CREATE INDEX "pages_blocks_toast_menu_pdf_idx" ON "pages_blocks_toast_menu" USING btree ("pdf_id");
  CREATE INDEX "pages_blocks_toast_visit_hours_order_idx" ON "pages_blocks_toast_visit_hours" USING btree ("_order");
  CREATE INDEX "pages_blocks_toast_visit_hours_parent_id_idx" ON "pages_blocks_toast_visit_hours" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toast_visit_order_idx" ON "pages_blocks_toast_visit" USING btree ("_order");
  CREATE INDEX "pages_blocks_toast_visit_parent_id_idx" ON "pages_blocks_toast_visit" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_toast_visit_path_idx" ON "pages_blocks_toast_visit" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_toast_hero_order_idx" ON "_pages_v_blocks_toast_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_toast_hero_parent_id_idx" ON "_pages_v_blocks_toast_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_toast_hero_path_idx" ON "_pages_v_blocks_toast_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_toast_statement_order_idx" ON "_pages_v_blocks_toast_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_toast_statement_parent_id_idx" ON "_pages_v_blocks_toast_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_toast_statement_path_idx" ON "_pages_v_blocks_toast_statement" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_toast_statement_aside_aside_image_idx" ON "_pages_v_blocks_toast_statement" USING btree ("aside_image_id");
  CREATE INDEX "_pages_v_blocks_toast_menu_sheets_order_idx" ON "_pages_v_blocks_toast_menu_sheets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_toast_menu_sheets_parent_id_idx" ON "_pages_v_blocks_toast_menu_sheets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_toast_menu_sheets_image_idx" ON "_pages_v_blocks_toast_menu_sheets" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_toast_menu_order_idx" ON "_pages_v_blocks_toast_menu" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_toast_menu_parent_id_idx" ON "_pages_v_blocks_toast_menu" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_toast_menu_path_idx" ON "_pages_v_blocks_toast_menu" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_toast_menu_pdf_idx" ON "_pages_v_blocks_toast_menu" USING btree ("pdf_id");
  CREATE INDEX "_pages_v_blocks_toast_visit_hours_order_idx" ON "_pages_v_blocks_toast_visit_hours" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_toast_visit_hours_parent_id_idx" ON "_pages_v_blocks_toast_visit_hours" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_toast_visit_order_idx" ON "_pages_v_blocks_toast_visit" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_toast_visit_parent_id_idx" ON "_pages_v_blocks_toast_visit" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_toast_visit_path_idx" ON "_pages_v_blocks_toast_visit" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_toast_hero" CASCADE;
  DROP TABLE "pages_blocks_toast_statement" CASCADE;
  DROP TABLE "pages_blocks_toast_menu_sheets" CASCADE;
  DROP TABLE "pages_blocks_toast_menu" CASCADE;
  DROP TABLE "pages_blocks_toast_visit_hours" CASCADE;
  DROP TABLE "pages_blocks_toast_visit" CASCADE;
  DROP TABLE "_pages_v_blocks_toast_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_toast_statement" CASCADE;
  DROP TABLE "_pages_v_blocks_toast_menu_sheets" CASCADE;
  DROP TABLE "_pages_v_blocks_toast_menu" CASCADE;
  DROP TABLE "_pages_v_blocks_toast_visit_hours" CASCADE;
  DROP TABLE "_pages_v_blocks_toast_visit" CASCADE;`)
}
