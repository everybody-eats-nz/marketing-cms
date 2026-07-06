import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "pages" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "pages" ADD COLUMN "published_by_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_published_by_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_published_by_id_users_id_fk" FOREIGN KEY ("version_published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_updated_by_idx" ON "pages" USING btree ("updated_by_id");
  CREATE INDEX "pages_created_by_idx" ON "pages" USING btree ("created_by_id");
  CREATE INDEX "pages_published_by_idx" ON "pages" USING btree ("published_by_id");
  CREATE INDEX "_pages_v_version_version_updated_by_idx" ON "_pages_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_pages_v_version_version_created_by_idx" ON "_pages_v" USING btree ("version_created_by_id");
  CREATE INDEX "_pages_v_version_version_published_by_idx" ON "_pages_v" USING btree ("version_published_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_updated_by_id_users_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_created_by_id_users_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_published_by_id_users_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_published_by_id_users_id_fk";
  
  DROP INDEX "pages_updated_by_idx";
  DROP INDEX "pages_created_by_idx";
  DROP INDEX "pages_published_by_idx";
  DROP INDEX "_pages_v_version_version_updated_by_idx";
  DROP INDEX "_pages_v_version_version_created_by_idx";
  DROP INDEX "_pages_v_version_version_published_by_idx";
  ALTER TABLE "pages" DROP COLUMN "updated_by_id";
  ALTER TABLE "pages" DROP COLUMN "created_by_id";
  ALTER TABLE "pages" DROP COLUMN "published_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_published_by_id";`)
}
