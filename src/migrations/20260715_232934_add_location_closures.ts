import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "locations_closures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"reason" varchar
  );
  
  CREATE TABLE "_locations_v_version_closures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"reason" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "locations_closures" ADD CONSTRAINT "locations_closures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_closures" ADD CONSTRAINT "_locations_v_version_closures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "locations_closures_order_idx" ON "locations_closures" USING btree ("_order");
  CREATE INDEX "locations_closures_parent_id_idx" ON "locations_closures" USING btree ("_parent_id");
  CREATE INDEX "_locations_v_version_closures_order_idx" ON "_locations_v_version_closures" USING btree ("_order");
  CREATE INDEX "_locations_v_version_closures_parent_id_idx" ON "_locations_v_version_closures" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "locations_closures" CASCADE;
  DROP TABLE "_locations_v_version_closures" CASCADE;`)
}
