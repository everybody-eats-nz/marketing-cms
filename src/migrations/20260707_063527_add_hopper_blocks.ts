import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_hopper_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'an everybody eats cafe',
  	"kicker_href" varchar DEFAULT '/',
  	"wordmark" varchar DEFAULT 'hOPPer',
  	"label" varchar DEFAULT 'cafe',
  	"address_line" varchar DEFAULT '11 Hopper St, Te Aro',
  	"hours_line" varchar DEFAULT 'Mon + Tues · 9am–2pm',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hopper_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hopper_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_hopper_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'On the counter',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hopper_visit_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar,
  	"times" varchar
  );
  
  CREATE TABLE "pages_blocks_hopper_visit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Find us',
  	"address" varchar DEFAULT '11 Hopper St
  Te Aro, Wellington',
  	"note" varchar,
  	"map_label" varchar DEFAULT 'Open in maps ↗',
  	"map_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hopper_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'an everybody eats cafe',
  	"kicker_href" varchar DEFAULT '/',
  	"wordmark" varchar DEFAULT 'hOPPer',
  	"label" varchar DEFAULT 'cafe',
  	"address_line" varchar DEFAULT '11 Hopper St, Te Aro',
  	"hours_line" varchar DEFAULT 'Mon + Tues · 9am–2pm',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hopper_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hopper_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hopper_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'On the counter',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hopper_visit_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"days" varchar,
  	"times" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hopper_visit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Find us',
  	"address" varchar DEFAULT '11 Hopper St
  Te Aro, Wellington',
  	"note" varchar,
  	"map_label" varchar DEFAULT 'Open in maps ↗',
  	"map_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hopper_hero" ADD CONSTRAINT "pages_blocks_hopper_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hopper_statement" ADD CONSTRAINT "pages_blocks_hopper_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hopper_menu_items" ADD CONSTRAINT "pages_blocks_hopper_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hopper_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hopper_menu" ADD CONSTRAINT "pages_blocks_hopper_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hopper_visit_hours" ADD CONSTRAINT "pages_blocks_hopper_visit_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hopper_visit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hopper_visit" ADD CONSTRAINT "pages_blocks_hopper_visit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hopper_hero" ADD CONSTRAINT "_pages_v_blocks_hopper_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hopper_statement" ADD CONSTRAINT "_pages_v_blocks_hopper_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hopper_menu_items" ADD CONSTRAINT "_pages_v_blocks_hopper_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hopper_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hopper_menu" ADD CONSTRAINT "_pages_v_blocks_hopper_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hopper_visit_hours" ADD CONSTRAINT "_pages_v_blocks_hopper_visit_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hopper_visit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hopper_visit" ADD CONSTRAINT "_pages_v_blocks_hopper_visit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hopper_hero_order_idx" ON "pages_blocks_hopper_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hopper_hero_parent_id_idx" ON "pages_blocks_hopper_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hopper_hero_path_idx" ON "pages_blocks_hopper_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hopper_statement_order_idx" ON "pages_blocks_hopper_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_hopper_statement_parent_id_idx" ON "pages_blocks_hopper_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hopper_statement_path_idx" ON "pages_blocks_hopper_statement" USING btree ("_path");
  CREATE INDEX "pages_blocks_hopper_menu_items_order_idx" ON "pages_blocks_hopper_menu_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_hopper_menu_items_parent_id_idx" ON "pages_blocks_hopper_menu_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hopper_menu_order_idx" ON "pages_blocks_hopper_menu" USING btree ("_order");
  CREATE INDEX "pages_blocks_hopper_menu_parent_id_idx" ON "pages_blocks_hopper_menu" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hopper_menu_path_idx" ON "pages_blocks_hopper_menu" USING btree ("_path");
  CREATE INDEX "pages_blocks_hopper_visit_hours_order_idx" ON "pages_blocks_hopper_visit_hours" USING btree ("_order");
  CREATE INDEX "pages_blocks_hopper_visit_hours_parent_id_idx" ON "pages_blocks_hopper_visit_hours" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hopper_visit_order_idx" ON "pages_blocks_hopper_visit" USING btree ("_order");
  CREATE INDEX "pages_blocks_hopper_visit_parent_id_idx" ON "pages_blocks_hopper_visit" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hopper_visit_path_idx" ON "pages_blocks_hopper_visit" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hopper_hero_order_idx" ON "_pages_v_blocks_hopper_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hopper_hero_parent_id_idx" ON "_pages_v_blocks_hopper_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hopper_hero_path_idx" ON "_pages_v_blocks_hopper_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hopper_statement_order_idx" ON "_pages_v_blocks_hopper_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hopper_statement_parent_id_idx" ON "_pages_v_blocks_hopper_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hopper_statement_path_idx" ON "_pages_v_blocks_hopper_statement" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hopper_menu_items_order_idx" ON "_pages_v_blocks_hopper_menu_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hopper_menu_items_parent_id_idx" ON "_pages_v_blocks_hopper_menu_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hopper_menu_order_idx" ON "_pages_v_blocks_hopper_menu" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hopper_menu_parent_id_idx" ON "_pages_v_blocks_hopper_menu" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hopper_menu_path_idx" ON "_pages_v_blocks_hopper_menu" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hopper_visit_hours_order_idx" ON "_pages_v_blocks_hopper_visit_hours" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hopper_visit_hours_parent_id_idx" ON "_pages_v_blocks_hopper_visit_hours" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hopper_visit_order_idx" ON "_pages_v_blocks_hopper_visit" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hopper_visit_parent_id_idx" ON "_pages_v_blocks_hopper_visit" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hopper_visit_path_idx" ON "_pages_v_blocks_hopper_visit" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hopper_hero" CASCADE;
  DROP TABLE "pages_blocks_hopper_statement" CASCADE;
  DROP TABLE "pages_blocks_hopper_menu_items" CASCADE;
  DROP TABLE "pages_blocks_hopper_menu" CASCADE;
  DROP TABLE "pages_blocks_hopper_visit_hours" CASCADE;
  DROP TABLE "pages_blocks_hopper_visit" CASCADE;
  DROP TABLE "_pages_v_blocks_hopper_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hopper_statement" CASCADE;
  DROP TABLE "_pages_v_blocks_hopper_menu_items" CASCADE;
  DROP TABLE "_pages_v_blocks_hopper_menu" CASCADE;
  DROP TABLE "_pages_v_blocks_hopper_visit_hours" CASCADE;
  DROP TABLE "_pages_v_blocks_hopper_visit" CASCADE;`)
}
