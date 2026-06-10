import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('tight', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_media_aspect" AS ENUM('16:8', '16:9', '4:3', '1:1', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_stats_variant" AS ENUM('light', 'darkPanel');
  CREATE TYPE "public"."enum_pages_blocks_stats_source" AS ENUM('global', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_items_color" AS ENUM('cream', 'sun', 'clay', 'forest100', 'forest700');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_card_style" AS ENUM('soft', 'tile', 'mixed');
  CREATE TYPE "public"."enum_pages_blocks_pillars_theme" AS ENUM('forest', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_cta_strip_variant" AS ENUM('sun', 'forest');
  CREATE TYPE "public"."enum_pages_blocks_cta_strip_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('tight', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_media_aspect" AS ENUM('16:8', '16:9', '4:3', '1:1', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_variant" AS ENUM('light', 'darkPanel');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_source" AS ENUM('global', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_items_color" AS ENUM('cream', 'sun', 'clay', 'forest100', 'forest700');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_card_style" AS ENUM('soft', 'tile', 'mixed');
  CREATE TYPE "public"."enum__pages_v_blocks_pillars_theme" AS ENUM('forest', 'cream');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_strip_variant" AS ENUM('sun', 'forest');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_strip_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_locations_open_status" AS ENUM('open', 'coming-soon', 'closed');
  CREATE TYPE "public"."enum_locations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__locations_v_version_open_status" AS ENUM('open', 'coming-soon', 'closed');
  CREATE TYPE "public"."enum__locations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_staff_type" AS ENUM('board', 'leadership', 'kitchen', 'foh', 'operations', 'volunteer');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_staff_type" AS ENUM('board', 'leadership', 'kitchen', 'foh', 'operations', 'volunteer');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_journal_posts_category" AS ENUM('story', 'news', 'recipe', 'behind-the-scenes', 'impact');
  CREATE TYPE "public"."enum_journal_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_posts_v_version_category" AS ENUM('story', 'news', 'recipe', 'behind-the-scenes', 'impact');
  CREATE TYPE "public"."enum__journal_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('pay-as-you-feel', 'about-us', 'dining', 'volunteering', 'donating', 'our-meals', 'events');
  CREATE TYPE "public"."enum_partners_tier" AS ENUM('platinum', 'gold', 'funding', 'supporting', 'hospitality', 'food');
  CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('instagram', 'facebook', 'linkedin', 'tiktok', 'youtube');
  CREATE TYPE "public"."enum_navigation_primary_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_navigation_secondary_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('internal', 'external');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"prefix" varchar DEFAULT '',
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"highlight_word" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"sticker_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_donate_hero_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_donate_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"panel_label" varchar DEFAULT 'A one-off gift',
  	"cta_label" varchar DEFAULT 'Donate now →',
  	"cta_href" varchar,
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'tight',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"aspect" "enum_pages_blocks_media_aspect" DEFAULT '16:8',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"variant" "enum_pages_blocks_stats_variant" DEFAULT 'light',
  	"source" "enum_pages_blocks_stats_source" DEFAULT 'global',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"copy" varchar
  );
  
  CREATE TABLE "pages_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"translation" varchar,
  	"copy" varchar
  );
  
  CREATE TABLE "pages_blocks_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"mission_label" varchar DEFAULT 'Our mission',
  	"mission" varchar,
  	"vision_label" varchar DEFAULT 'Our vision',
  	"vision" varchar,
  	"values_label" varchar DEFAULT 'Ngā Uara — our values',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"email" varchar,
  	"cta_label" varchar,
  	"href" varchar,
  	"color" "enum_pages_blocks_card_grid_items_color" DEFAULT 'cream'
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"columns" "enum_pages_blocks_card_grid_columns" DEFAULT '3',
  	"card_style" "enum_pages_blocks_card_grid_card_style" DEFAULT 'soft',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"cta_label" varchar DEFAULT 'Learn more',
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"theme" "enum_pages_blocks_pillars_theme" DEFAULT 'forest',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"variant" "enum_pages_blocks_cta_strip_variant" DEFAULT 'sun',
  	"align" "enum_pages_blocks_cta_strip_align" DEFAULT 'left',
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_locations_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_locations_magazine" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_events_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"limit" numeric DEFAULT 4,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_journal_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faqs_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"highlight_word" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"sticker_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donate_hero_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donate_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"panel_label" varchar DEFAULT 'A one-off gift',
  	"cta_label" varchar DEFAULT 'Donate now →',
  	"cta_href" varchar,
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'tight',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"aspect" "enum__pages_v_blocks_media_aspect" DEFAULT '16:8',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"variant" "enum__pages_v_blocks_stats_variant" DEFAULT 'light',
  	"source" "enum__pages_v_blocks_stats_source" DEFAULT 'global',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"translation" varchar,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"mission_label" varchar DEFAULT 'Our mission',
  	"mission" varchar,
  	"vision_label" varchar DEFAULT 'Our vision',
  	"vision" varchar,
  	"values_label" varchar DEFAULT 'Ngā Uara — our values',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"email" varchar,
  	"cta_label" varchar,
  	"href" varchar,
  	"color" "enum__pages_v_blocks_card_grid_items_color" DEFAULT 'cream',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"columns" "enum__pages_v_blocks_card_grid_columns" DEFAULT '3',
  	"card_style" "enum__pages_v_blocks_card_grid_card_style" DEFAULT 'soft',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"copy" varchar,
  	"cta_label" varchar DEFAULT 'Learn more',
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"theme" "enum__pages_v_blocks_pillars_theme" DEFAULT 'forest',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"variant" "enum__pages_v_blocks_cta_strip_variant" DEFAULT 'sun',
  	"align" "enum__pages_v_blocks_cta_strip_align" DEFAULT 'left',
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_locations_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_locations_magazine" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"limit" numeric DEFAULT 4,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_journal_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faqs_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"view_all_label" varchar,
  	"view_all_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "locations_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "locations_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"times" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "locations_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"open_status" "enum_locations_open_status" DEFAULT 'open',
  	"tagline" varchar,
  	"intro" varchar,
  	"body" jsonb,
  	"hero_image_id" integer,
  	"city" varchar,
  	"address" varchar,
  	"coordinates_lat" numeric,
  	"coordinates_lng" numeric,
  	"phone" varchar,
  	"email" varchar,
  	"booking_url" varchar,
  	"pay_at_table_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_locations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "locations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"quotes_id" integer
  );
  
  CREATE TABLE "_locations_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_locations_v_version_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"times" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_locations_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_locations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_open_status" "enum__locations_v_version_open_status" DEFAULT 'open',
  	"version_tagline" varchar,
  	"version_intro" varchar,
  	"version_body" jsonb,
  	"version_hero_image_id" integer,
  	"version_city" varchar,
  	"version_address" varchar,
  	"version_coordinates_lat" numeric,
  	"version_coordinates_lng" numeric,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_booking_url" varchar,
  	"version_pay_at_table_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__locations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_locations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"quotes_id" integer
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"job_title" varchar,
  	"staff_type" "enum_team_members_staff_type",
  	"display_order" numeric DEFAULT 0,
  	"profile_picture_id" integer,
  	"bio_summary" varchar,
  	"bio" jsonb,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_twitter" varchar,
  	"contact_facebook" varchar,
  	"contact_linkedin" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_job_title" varchar,
  	"version_staff_type" "enum__team_members_v_version_staff_type",
  	"version_display_order" numeric DEFAULT 0,
  	"version_profile_picture_id" integer,
  	"version_bio_summary" varchar,
  	"version_bio" jsonb,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_contact_twitter" varchar,
  	"version_contact_facebook" varchar,
  	"version_contact_linkedin" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"display_time" varchar,
  	"location_id" integer,
  	"image_id" integer,
  	"short_description" varchar,
  	"description" jsonb,
  	"tickets_price_label" varchar,
  	"tickets_ticket_url" varchar,
  	"tickets_caption" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_display_time" varchar,
  	"version_location_id" integer,
  	"version_image_id" integer,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_tickets_price_label" varchar,
  	"version_tickets_ticket_url" varchar,
  	"version_tickets_caption" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "journal_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" "enum_journal_posts_category",
  	"summary" varchar,
  	"main_image_id" integer,
  	"author" varchar,
  	"author_member_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_journal_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__journal_posts_v_version_category",
  	"version_summary" varchar,
  	"version_main_image_id" integer,
  	"version_author" varchar,
  	"version_author_member_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar NOT NULL,
  	"location_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" "enum_faqs_category",
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"tier" "enum_partners_tier" NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"description" varchar,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"locations_id" integer,
  	"team_members_id" integer,
  	"events_id" integer,
  	"journal_posts_id" integer,
  	"quotes_id" integer,
  	"faqs_id" integer,
  	"partners_id" integer,
  	"daily_menus_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Everybody Eats',
  	"tagline" varchar DEFAULT 'Making a difference one plate at a time',
  	"description" varchar,
  	"logo_light_id" integer,
  	"logo_dark_id" integer,
  	"favicon_id" integer,
  	"og_image_id" integer,
  	"contact_email" varchar,
  	"press_email" varchar,
  	"volunteer_email" varchar,
  	"phone" varchar,
  	"charity_number" varchar DEFAULT 'CC56055',
  	"mailing_address" varchar,
  	"booking_url" varchar,
  	"donate_url" varchar,
  	"volunteer_url" varchar,
  	"shop_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_primary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_navigation_primary_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false,
  	"preview_image_id" integer
  );
  
  CREATE TABLE "navigation_secondary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_navigation_secondary_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ctas_book_label" varchar DEFAULT 'Book',
  	"ctas_donate_label" varchar DEFAULT 'Donate',
  	"ctas_shop_label" varchar DEFAULT 'Shop',
  	"ctas_show_shop" boolean DEFAULT true,
  	"ctas_volunteer_label" varchar DEFAULT 'Volunteer',
  	"ctas_show_volunteer" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_footer_legal_links_link_type" DEFAULT 'internal',
  	"link_internal_href" varchar,
  	"link_external_href" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar DEFAULT 'Make a difference one plate at a time',
  	"copyright" varchar DEFAULT '© Everybody Eats',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donate_hero_amounts" ADD CONSTRAINT "pages_blocks_donate_hero_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_donate_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donate_hero" ADD CONSTRAINT "pages_blocks_donate_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media" ADD CONSTRAINT "pages_blocks_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media" ADD CONSTRAINT "pages_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_items" ADD CONSTRAINT "pages_blocks_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee" ADD CONSTRAINT "pages_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_items" ADD CONSTRAINT "pages_blocks_process_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_values_items" ADD CONSTRAINT "pages_blocks_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_values" ADD CONSTRAINT "pages_blocks_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_items" ADD CONSTRAINT "pages_blocks_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars_items" ADD CONSTRAINT "pages_blocks_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars" ADD CONSTRAINT "pages_blocks_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_strip" ADD CONSTRAINT "pages_blocks_cta_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_locations_grid" ADD CONSTRAINT "pages_blocks_locations_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_locations_magazine" ADD CONSTRAINT "pages_blocks_locations_magazine_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_list" ADD CONSTRAINT "pages_blocks_events_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_journal_list" ADD CONSTRAINT "pages_blocks_journal_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid" ADD CONSTRAINT "pages_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faqs_accordion" ADD CONSTRAINT "pages_blocks_faqs_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_grid" ADD CONSTRAINT "pages_blocks_partners_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter_form" ADD CONSTRAINT "pages_blocks_newsletter_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donate_hero_amounts" ADD CONSTRAINT "_pages_v_blocks_donate_hero_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_donate_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donate_hero" ADD CONSTRAINT "_pages_v_blocks_donate_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media" ADD CONSTRAINT "_pages_v_blocks_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media" ADD CONSTRAINT "_pages_v_blocks_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee_items" ADD CONSTRAINT "_pages_v_blocks_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee" ADD CONSTRAINT "_pages_v_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_items" ADD CONSTRAINT "_pages_v_blocks_process_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process" ADD CONSTRAINT "_pages_v_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_values_items" ADD CONSTRAINT "_pages_v_blocks_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_values" ADD CONSTRAINT "_pages_v_blocks_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_items" ADD CONSTRAINT "_pages_v_blocks_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars_items" ADD CONSTRAINT "_pages_v_blocks_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars" ADD CONSTRAINT "_pages_v_blocks_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_strip" ADD CONSTRAINT "_pages_v_blocks_cta_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_locations_grid" ADD CONSTRAINT "_pages_v_blocks_locations_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_locations_magazine" ADD CONSTRAINT "_pages_v_blocks_locations_magazine_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_list" ADD CONSTRAINT "_pages_v_blocks_events_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_journal_list" ADD CONSTRAINT "_pages_v_blocks_journal_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD CONSTRAINT "_pages_v_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faqs_accordion" ADD CONSTRAINT "_pages_v_blocks_faqs_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_grid" ADD CONSTRAINT "_pages_v_blocks_partners_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_form" ADD CONSTRAINT "_pages_v_blocks_newsletter_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_hours" ADD CONSTRAINT "locations_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_highlights" ADD CONSTRAINT "locations_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_gallery" ADD CONSTRAINT "_locations_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_version_gallery" ADD CONSTRAINT "_locations_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_hours" ADD CONSTRAINT "_locations_v_version_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_version_highlights" ADD CONSTRAINT "_locations_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_rels" ADD CONSTRAINT "_locations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v_rels" ADD CONSTRAINT "_locations_v_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_profile_picture_id_media_id_fk" FOREIGN KEY ("profile_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_profile_picture_id_media_id_fk" FOREIGN KEY ("version_profile_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_location_id_locations_id_fk" FOREIGN KEY ("version_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_author_member_id_team_members_id_fk" FOREIGN KEY ("author_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_parent_id_journal_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_main_image_id_media_id_fk" FOREIGN KEY ("version_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_author_member_id_team_members_id_fk" FOREIGN KEY ("version_author_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quotes" ADD CONSTRAINT "quotes_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "daily_menus" ADD CONSTRAINT "daily_menus_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_daily_menus_fk" FOREIGN KEY ("daily_menus_id") REFERENCES "public"."daily_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_primary" ADD CONSTRAINT "navigation_primary_preview_image_id_media_id_fk" FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_primary" ADD CONSTRAINT "navigation_primary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_secondary" ADD CONSTRAINT "navigation_secondary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_donate_hero_amounts_order_idx" ON "pages_blocks_donate_hero_amounts" USING btree ("_order");
  CREATE INDEX "pages_blocks_donate_hero_amounts_parent_id_idx" ON "pages_blocks_donate_hero_amounts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donate_hero_order_idx" ON "pages_blocks_donate_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_donate_hero_parent_id_idx" ON "pages_blocks_donate_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donate_hero_path_idx" ON "pages_blocks_donate_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_order_idx" ON "pages_blocks_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_parent_id_idx" ON "pages_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_path_idx" ON "pages_blocks_media" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_image_idx" ON "pages_blocks_media" USING btree ("image_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_marquee_items_order_idx" ON "pages_blocks_marquee_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_items_parent_id_idx" ON "pages_blocks_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_order_idx" ON "pages_blocks_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_parent_id_idx" ON "pages_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_path_idx" ON "pages_blocks_marquee" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_items_order_idx" ON "pages_blocks_process_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_items_parent_id_idx" ON "pages_blocks_process_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_order_idx" ON "pages_blocks_process" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_parent_id_idx" ON "pages_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_path_idx" ON "pages_blocks_process" USING btree ("_path");
  CREATE INDEX "pages_blocks_values_items_order_idx" ON "pages_blocks_values_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_items_parent_id_idx" ON "pages_blocks_values_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_order_idx" ON "pages_blocks_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_parent_id_idx" ON "pages_blocks_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_path_idx" ON "pages_blocks_values" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_items_order_idx" ON "pages_blocks_card_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_items_parent_id_idx" ON "pages_blocks_card_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_pillars_items_order_idx" ON "pages_blocks_pillars_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillars_items_parent_id_idx" ON "pages_blocks_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillars_order_idx" ON "pages_blocks_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillars_parent_id_idx" ON "pages_blocks_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillars_path_idx" ON "pages_blocks_pillars" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_strip_order_idx" ON "pages_blocks_cta_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_strip_parent_id_idx" ON "pages_blocks_cta_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_strip_path_idx" ON "pages_blocks_cta_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_locations_grid_order_idx" ON "pages_blocks_locations_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_locations_grid_parent_id_idx" ON "pages_blocks_locations_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_locations_grid_path_idx" ON "pages_blocks_locations_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_locations_magazine_order_idx" ON "pages_blocks_locations_magazine" USING btree ("_order");
  CREATE INDEX "pages_blocks_locations_magazine_parent_id_idx" ON "pages_blocks_locations_magazine" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_locations_magazine_path_idx" ON "pages_blocks_locations_magazine" USING btree ("_path");
  CREATE INDEX "pages_blocks_events_list_order_idx" ON "pages_blocks_events_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_list_parent_id_idx" ON "pages_blocks_events_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_list_path_idx" ON "pages_blocks_events_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_journal_list_order_idx" ON "pages_blocks_journal_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_journal_list_parent_id_idx" ON "pages_blocks_journal_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_journal_list_path_idx" ON "pages_blocks_journal_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_grid_order_idx" ON "pages_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_parent_id_idx" ON "pages_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_path_idx" ON "pages_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_faqs_accordion_order_idx" ON "pages_blocks_faqs_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_faqs_accordion_parent_id_idx" ON "pages_blocks_faqs_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faqs_accordion_path_idx" ON "pages_blocks_faqs_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_partners_grid_order_idx" ON "pages_blocks_partners_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_grid_parent_id_idx" ON "pages_blocks_partners_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_grid_path_idx" ON "pages_blocks_partners_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_form_order_idx" ON "pages_blocks_newsletter_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_form_parent_id_idx" ON "pages_blocks_newsletter_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_form_path_idx" ON "pages_blocks_newsletter_form" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_donate_hero_amounts_order_idx" ON "_pages_v_blocks_donate_hero_amounts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donate_hero_amounts_parent_id_idx" ON "_pages_v_blocks_donate_hero_amounts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donate_hero_order_idx" ON "_pages_v_blocks_donate_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donate_hero_parent_id_idx" ON "_pages_v_blocks_donate_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donate_hero_path_idx" ON "_pages_v_blocks_donate_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_order_idx" ON "_pages_v_blocks_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_parent_id_idx" ON "_pages_v_blocks_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_path_idx" ON "_pages_v_blocks_media" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_image_idx" ON "_pages_v_blocks_media" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_marquee_items_order_idx" ON "_pages_v_blocks_marquee_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_items_parent_id_idx" ON "_pages_v_blocks_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_order_idx" ON "_pages_v_blocks_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_parent_id_idx" ON "_pages_v_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_path_idx" ON "_pages_v_blocks_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_process_items_order_idx" ON "_pages_v_blocks_process_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_items_parent_id_idx" ON "_pages_v_blocks_process_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_order_idx" ON "_pages_v_blocks_process" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_parent_id_idx" ON "_pages_v_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_path_idx" ON "_pages_v_blocks_process" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_values_items_order_idx" ON "_pages_v_blocks_values_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_values_items_parent_id_idx" ON "_pages_v_blocks_values_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_values_order_idx" ON "_pages_v_blocks_values" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_values_parent_id_idx" ON "_pages_v_blocks_values" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_values_path_idx" ON "_pages_v_blocks_values" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_items_order_idx" ON "_pages_v_blocks_card_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_items_parent_id_idx" ON "_pages_v_blocks_card_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pillars_items_order_idx" ON "_pages_v_blocks_pillars_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillars_items_parent_id_idx" ON "_pages_v_blocks_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_order_idx" ON "_pages_v_blocks_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillars_parent_id_idx" ON "_pages_v_blocks_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_path_idx" ON "_pages_v_blocks_pillars" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_strip_order_idx" ON "_pages_v_blocks_cta_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_strip_parent_id_idx" ON "_pages_v_blocks_cta_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_strip_path_idx" ON "_pages_v_blocks_cta_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_locations_grid_order_idx" ON "_pages_v_blocks_locations_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_locations_grid_parent_id_idx" ON "_pages_v_blocks_locations_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_locations_grid_path_idx" ON "_pages_v_blocks_locations_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_locations_magazine_order_idx" ON "_pages_v_blocks_locations_magazine" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_locations_magazine_parent_id_idx" ON "_pages_v_blocks_locations_magazine" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_locations_magazine_path_idx" ON "_pages_v_blocks_locations_magazine" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_events_list_order_idx" ON "_pages_v_blocks_events_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_list_parent_id_idx" ON "_pages_v_blocks_events_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_list_path_idx" ON "_pages_v_blocks_events_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_journal_list_order_idx" ON "_pages_v_blocks_journal_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_journal_list_parent_id_idx" ON "_pages_v_blocks_journal_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_journal_list_path_idx" ON "_pages_v_blocks_journal_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_grid_order_idx" ON "_pages_v_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_grid_parent_id_idx" ON "_pages_v_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_grid_path_idx" ON "_pages_v_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faqs_accordion_order_idx" ON "_pages_v_blocks_faqs_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faqs_accordion_parent_id_idx" ON "_pages_v_blocks_faqs_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faqs_accordion_path_idx" ON "_pages_v_blocks_faqs_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partners_grid_order_idx" ON "_pages_v_blocks_partners_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_grid_parent_id_idx" ON "_pages_v_blocks_partners_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_grid_path_idx" ON "_pages_v_blocks_partners_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_form_order_idx" ON "_pages_v_blocks_newsletter_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_form_parent_id_idx" ON "_pages_v_blocks_newsletter_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_form_path_idx" ON "_pages_v_blocks_newsletter_form" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "locations_gallery_order_idx" ON "locations_gallery" USING btree ("_order");
  CREATE INDEX "locations_gallery_parent_id_idx" ON "locations_gallery" USING btree ("_parent_id");
  CREATE INDEX "locations_gallery_image_idx" ON "locations_gallery" USING btree ("image_id");
  CREATE INDEX "locations_hours_order_idx" ON "locations_hours" USING btree ("_order");
  CREATE INDEX "locations_hours_parent_id_idx" ON "locations_hours" USING btree ("_parent_id");
  CREATE INDEX "locations_highlights_order_idx" ON "locations_highlights" USING btree ("_order");
  CREATE INDEX "locations_highlights_parent_id_idx" ON "locations_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_hero_image_idx" ON "locations" USING btree ("hero_image_id");
  CREATE INDEX "locations_seo_seo_image_idx" ON "locations" USING btree ("seo_image_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "locations__status_idx" ON "locations" USING btree ("_status");
  CREATE INDEX "locations_rels_order_idx" ON "locations_rels" USING btree ("order");
  CREATE INDEX "locations_rels_parent_idx" ON "locations_rels" USING btree ("parent_id");
  CREATE INDEX "locations_rels_path_idx" ON "locations_rels" USING btree ("path");
  CREATE INDEX "locations_rels_quotes_id_idx" ON "locations_rels" USING btree ("quotes_id");
  CREATE INDEX "_locations_v_version_gallery_order_idx" ON "_locations_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_locations_v_version_gallery_parent_id_idx" ON "_locations_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_locations_v_version_gallery_image_idx" ON "_locations_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_locations_v_version_hours_order_idx" ON "_locations_v_version_hours" USING btree ("_order");
  CREATE INDEX "_locations_v_version_hours_parent_id_idx" ON "_locations_v_version_hours" USING btree ("_parent_id");
  CREATE INDEX "_locations_v_version_highlights_order_idx" ON "_locations_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_locations_v_version_highlights_parent_id_idx" ON "_locations_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_locations_v_parent_idx" ON "_locations_v" USING btree ("parent_id");
  CREATE INDEX "_locations_v_version_version_slug_idx" ON "_locations_v" USING btree ("version_slug");
  CREATE INDEX "_locations_v_version_version_hero_image_idx" ON "_locations_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_locations_v_version_seo_version_seo_image_idx" ON "_locations_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_locations_v_version_version_updated_at_idx" ON "_locations_v" USING btree ("version_updated_at");
  CREATE INDEX "_locations_v_version_version_created_at_idx" ON "_locations_v" USING btree ("version_created_at");
  CREATE INDEX "_locations_v_version_version__status_idx" ON "_locations_v" USING btree ("version__status");
  CREATE INDEX "_locations_v_created_at_idx" ON "_locations_v" USING btree ("created_at");
  CREATE INDEX "_locations_v_updated_at_idx" ON "_locations_v" USING btree ("updated_at");
  CREATE INDEX "_locations_v_latest_idx" ON "_locations_v" USING btree ("latest");
  CREATE INDEX "_locations_v_rels_order_idx" ON "_locations_v_rels" USING btree ("order");
  CREATE INDEX "_locations_v_rels_parent_idx" ON "_locations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_locations_v_rels_path_idx" ON "_locations_v_rels" USING btree ("path");
  CREATE INDEX "_locations_v_rels_quotes_id_idx" ON "_locations_v_rels" USING btree ("quotes_id");
  CREATE UNIQUE INDEX "team_members_slug_idx" ON "team_members" USING btree ("slug");
  CREATE INDEX "team_members_profile_picture_idx" ON "team_members" USING btree ("profile_picture_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_slug_idx" ON "_team_members_v" USING btree ("version_slug");
  CREATE INDEX "_team_members_v_version_version_profile_picture_idx" ON "_team_members_v" USING btree ("version_profile_picture_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_location_idx" ON "events" USING btree ("location_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_seo_seo_image_idx" ON "events" USING btree ("seo_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_location_idx" ON "_events_v" USING btree ("version_location_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_seo_version_seo_image_idx" ON "_events_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "journal_posts_slug_idx" ON "journal_posts" USING btree ("slug");
  CREATE INDEX "journal_posts_main_image_idx" ON "journal_posts" USING btree ("main_image_id");
  CREATE INDEX "journal_posts_author_member_idx" ON "journal_posts" USING btree ("author_member_id");
  CREATE INDEX "journal_posts_seo_seo_image_idx" ON "journal_posts" USING btree ("seo_image_id");
  CREATE INDEX "journal_posts_updated_at_idx" ON "journal_posts" USING btree ("updated_at");
  CREATE INDEX "journal_posts_created_at_idx" ON "journal_posts" USING btree ("created_at");
  CREATE INDEX "journal_posts__status_idx" ON "journal_posts" USING btree ("_status");
  CREATE INDEX "_journal_posts_v_parent_idx" ON "_journal_posts_v" USING btree ("parent_id");
  CREATE INDEX "_journal_posts_v_version_version_slug_idx" ON "_journal_posts_v" USING btree ("version_slug");
  CREATE INDEX "_journal_posts_v_version_version_main_image_idx" ON "_journal_posts_v" USING btree ("version_main_image_id");
  CREATE INDEX "_journal_posts_v_version_version_author_member_idx" ON "_journal_posts_v" USING btree ("version_author_member_id");
  CREATE INDEX "_journal_posts_v_version_seo_version_seo_image_idx" ON "_journal_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_journal_posts_v_version_version_updated_at_idx" ON "_journal_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_posts_v_version_version_created_at_idx" ON "_journal_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_posts_v_version_version__status_idx" ON "_journal_posts_v" USING btree ("version__status");
  CREATE INDEX "_journal_posts_v_created_at_idx" ON "_journal_posts_v" USING btree ("created_at");
  CREATE INDEX "_journal_posts_v_updated_at_idx" ON "_journal_posts_v" USING btree ("updated_at");
  CREATE INDEX "_journal_posts_v_latest_idx" ON "_journal_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "quotes_slug_idx" ON "quotes" USING btree ("slug");
  CREATE INDEX "quotes_location_idx" ON "quotes" USING btree ("location_id");
  CREATE INDEX "quotes_updated_at_idx" ON "quotes" USING btree ("updated_at");
  CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE UNIQUE INDEX "daily_menus_slug_idx" ON "daily_menus" USING btree ("slug");
  CREATE INDEX "daily_menus_location_idx" ON "daily_menus" USING btree ("location_id");
  CREATE INDEX "daily_menus_updated_at_idx" ON "daily_menus" USING btree ("updated_at");
  CREATE INDEX "daily_menus_created_at_idx" ON "daily_menus" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_journal_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_posts_id");
  CREATE INDEX "payload_locked_documents_rels_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("quotes_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_daily_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("daily_menus_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_light_idx" ON "site_settings" USING btree ("logo_light_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "site_settings" USING btree ("logo_dark_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "navigation_primary_order_idx" ON "navigation_primary" USING btree ("_order");
  CREATE INDEX "navigation_primary_parent_id_idx" ON "navigation_primary" USING btree ("_parent_id");
  CREATE INDEX "navigation_primary_preview_image_idx" ON "navigation_primary" USING btree ("preview_image_id");
  CREATE INDEX "navigation_secondary_order_idx" ON "navigation_secondary" USING btree ("_order");
  CREATE INDEX "navigation_secondary_parent_id_idx" ON "navigation_secondary" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_donate_hero_amounts" CASCADE;
  DROP TABLE "pages_blocks_donate_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_media" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_marquee_items" CASCADE;
  DROP TABLE "pages_blocks_marquee" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_process_items" CASCADE;
  DROP TABLE "pages_blocks_process" CASCADE;
  DROP TABLE "pages_blocks_values_items" CASCADE;
  DROP TABLE "pages_blocks_values" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_card_grid_items" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_pillars_items" CASCADE;
  DROP TABLE "pages_blocks_pillars" CASCADE;
  DROP TABLE "pages_blocks_cta_strip" CASCADE;
  DROP TABLE "pages_blocks_locations_grid" CASCADE;
  DROP TABLE "pages_blocks_locations_magazine" CASCADE;
  DROP TABLE "pages_blocks_events_list" CASCADE;
  DROP TABLE "pages_blocks_journal_list" CASCADE;
  DROP TABLE "pages_blocks_team_grid" CASCADE;
  DROP TABLE "pages_blocks_faqs_accordion" CASCADE;
  DROP TABLE "pages_blocks_partners_grid" CASCADE;
  DROP TABLE "pages_blocks_newsletter_form" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_donate_hero_amounts" CASCADE;
  DROP TABLE "_pages_v_blocks_donate_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_media" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee_items" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_process_items" CASCADE;
  DROP TABLE "_pages_v_blocks_process" CASCADE;
  DROP TABLE "_pages_v_blocks_values_items" CASCADE;
  DROP TABLE "_pages_v_blocks_values" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars_items" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_locations_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_locations_magazine" CASCADE;
  DROP TABLE "_pages_v_blocks_events_list" CASCADE;
  DROP TABLE "_pages_v_blocks_journal_list" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_faqs_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_form" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "locations_gallery" CASCADE;
  DROP TABLE "locations_hours" CASCADE;
  DROP TABLE "locations_highlights" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_rels" CASCADE;
  DROP TABLE "_locations_v_version_gallery" CASCADE;
  DROP TABLE "_locations_v_version_hours" CASCADE;
  DROP TABLE "_locations_v_version_highlights" CASCADE;
  DROP TABLE "_locations_v" CASCADE;
  DROP TABLE "_locations_v_rels" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "journal_posts" CASCADE;
  DROP TABLE "_journal_posts_v" CASCADE;
  DROP TABLE "quotes" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "daily_menus" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_primary" CASCADE;
  DROP TABLE "navigation_secondary" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_media_aspect";
  DROP TYPE "public"."enum_pages_blocks_stats_variant";
  DROP TYPE "public"."enum_pages_blocks_stats_source";
  DROP TYPE "public"."enum_pages_blocks_card_grid_items_color";
  DROP TYPE "public"."enum_pages_blocks_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_card_grid_card_style";
  DROP TYPE "public"."enum_pages_blocks_pillars_theme";
  DROP TYPE "public"."enum_pages_blocks_cta_strip_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_strip_align";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_media_aspect";
  DROP TYPE "public"."enum__pages_v_blocks_stats_variant";
  DROP TYPE "public"."enum__pages_v_blocks_stats_source";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_items_color";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_card_style";
  DROP TYPE "public"."enum__pages_v_blocks_pillars_theme";
  DROP TYPE "public"."enum__pages_v_blocks_cta_strip_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_strip_align";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_locations_open_status";
  DROP TYPE "public"."enum_locations_status";
  DROP TYPE "public"."enum__locations_v_version_open_status";
  DROP TYPE "public"."enum__locations_v_version_status";
  DROP TYPE "public"."enum_team_members_staff_type";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_staff_type";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_journal_posts_category";
  DROP TYPE "public"."enum_journal_posts_status";
  DROP TYPE "public"."enum__journal_posts_v_version_category";
  DROP TYPE "public"."enum__journal_posts_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_partners_tier";
  DROP TYPE "public"."enum_site_settings_social_platform";
  DROP TYPE "public"."enum_navigation_primary_link_type";
  DROP TYPE "public"."enum_navigation_secondary_link_type";
  DROP TYPE "public"."enum_footer_columns_links_link_type";
  DROP TYPE "public"."enum_footer_legal_links_link_type";`)
}
