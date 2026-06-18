import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pay_settings_amounts_presets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pay_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"amounts_min_amount" numeric,
  	"amounts_max_amount" numeric,
  	"picker_eyebrow" varchar,
  	"picker_heading" varchar,
  	"picker_subheading" varchar,
  	"picker_special_events_label" varchar,
  	"picker_security_note" varchar,
  	"picker_meta_title" varchar,
  	"picker_meta_description" varchar,
  	"payment_eyebrow_location" varchar,
  	"payment_eyebrow_special" varchar,
  	"payment_heading" varchar,
  	"payment_explanation" varchar,
  	"payment_change_restaurant" varchar,
  	"payment_meta_title" varchar,
  	"payment_meta_description" varchar,
  	"form_pay_prompt" varchar,
  	"form_donation_prompt" varchar,
  	"form_other_placeholder" varchar,
  	"form_email_placeholder" varchar,
  	"form_continue_label" varchar,
  	"form_one_moment_label" varchar,
  	"form_security_note1" varchar,
  	"form_security_note2" varchar,
  	"form_koha_note" varchar,
  	"form_giving_label" varchar,
  	"form_change_amount_label" varchar,
  	"form_or_pay_by_card" varchar,
  	"form_give_label" varchar,
  	"form_processing_label" varchar,
  	"form_card_security_note" varchar,
  	"form_choose_amount_error" varchar,
  	"form_range_error" varchar,
  	"form_not_configured" varchar,
  	"thanks_eyebrow" varchar,
  	"thanks_heading" varchar,
  	"thanks_message_with_location" varchar,
  	"thanks_message_no_location" varchar,
  	"thanks_message_fallback" varchar,
  	"thanks_receipt_note" varchar,
  	"thanks_koha_note" varchar,
  	"thanks_book_label" varchar,
  	"thanks_other_ways_label" varchar,
  	"thanks_closing" varchar,
  	"thanks_meta_title" varchar,
  	"feedback_heading" varchar,
  	"feedback_optional_label" varchar,
  	"feedback_subtitle" varchar,
  	"feedback_placeholder" varchar,
  	"feedback_rating_label" varchar,
  	"feedback_name_placeholder" varchar,
  	"feedback_consent_label" varchar,
  	"feedback_submit_label" varchar,
  	"feedback_sending_label" varchar,
  	"feedback_empty_error" varchar,
  	"feedback_done_title" varchar,
  	"feedback_done_published" varchar,
  	"feedback_done_unpublished" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pay_settings_amounts_presets" ADD CONSTRAINT "pay_settings_amounts_presets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pay_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pay_settings_amounts_presets_order_idx" ON "pay_settings_amounts_presets" USING btree ("_order");
  CREATE INDEX "pay_settings_amounts_presets_parent_id_idx" ON "pay_settings_amounts_presets" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pay_settings_amounts_presets" CASCADE;
  DROP TABLE "pay_settings" CASCADE;`)
}
