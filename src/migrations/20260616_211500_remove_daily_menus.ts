import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "daily_menus_id";
  DROP TABLE IF EXISTS "daily_menus" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "daily_menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"menu_date" timestamp(3) with time zone NOT NULL,
  	"location_id" integer,
  	"chef_name" varchar,
  	"courses_starter" varchar,
  	"courses_main_meat" varchar,
  	"courses_main_veg" varchar,
  	"courses_veg_only" boolean,
  	"courses_dessert" varchar,
  	"courses_drink" varchar,
  	"announcement" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "daily_menus_id" integer;
  ALTER TABLE "daily_menus" ADD CONSTRAINT "daily_menus_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_daily_menus_fk" FOREIGN KEY ("daily_menus_id") REFERENCES "public"."daily_menus"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "daily_menus_slug_idx" ON "daily_menus" USING btree ("slug");
  CREATE INDEX "daily_menus_location_idx" ON "daily_menus" USING btree ("location_id");
  CREATE INDEX "daily_menus_updated_at_idx" ON "daily_menus" USING btree ("updated_at");
  CREATE INDEX "daily_menus_created_at_idx" ON "daily_menus" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_daily_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("daily_menus_id");`)
}
