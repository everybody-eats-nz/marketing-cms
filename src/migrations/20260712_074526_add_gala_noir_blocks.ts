import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_gala_noir_hero_ribbon" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'Fundraising event — 30 October 2026',
  	"kit_line" varchar DEFAULT 'Event *Sponsorship* Kit',
  	"script_line" varchar DEFAULT 'everybody eats',
  	"word" varchar DEFAULT 'GALA',
  	"intro" varchar DEFAULT 'One audacious night of exquisite dining, high-class drag cabaret and generous bidding — so that everybody eats.',
  	"primary_cta_label" varchar DEFAULT 'Sponsor the Gala',
  	"secondary_cta_label" varchar DEFAULT 'Host a table',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"show_countdown" boolean DEFAULT true,
  	"gala_date_time" timestamp(3) with time zone DEFAULT '2026-10-30T18:30:00+13:00',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_problem_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_problem" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'Why this night matters',
  	"heading" varchar DEFAULT 'The *Problem*',
  	"pull_quote" varchar DEFAULT 'Nearly half — *49%* — of food-insecure households in New Zealand are too ashamed or embarrassed to ask for support.',
  	"sources" varchar DEFAULT 'Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the Environment · Ministry of Health',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_about_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What is *Everybody Eats?*',
  	"tagline" varchar DEFAULT 'Making a difference, one plate at a time.',
  	"body_left" varchar DEFAULT 'Everybody Eats runs charity restaurants which bring communities together through dignified hospitality experiences. With a mission to tackle food waste, food insecurity and social isolation in Aotearoa New Zealand, our teams of hospitality professionals and volunteers rescue and transform surplus food into quality three-course meals, served nightly at our pay-what-you-can restaurants.',
  	"body_right" varchar DEFAULT 'Founded in Auckland in 2017, we have grown from a weekly pop-up on Karangahape Road into a national movement with three permanent restaurants and pop-ups across the motu.',
  	"link_label" varchar DEFAULT 'everybodyeats.nz',
  	"link_url" varchar DEFAULT 'https://everybodyeats.nz',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_night_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_night" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_caption" varchar DEFAULT 'Images from previous Everybody Eats Galas',
  	"eyebrow" varchar DEFAULT 'Friday 30 October 2026 · 6:30pm · St Matthew-in-the-City',
  	"heading" varchar DEFAULT 'An *unforgettable* evening',
  	"body" varchar DEFAULT 'The Everybody Eats Gala is our most audacious fundraising event to date. Alongside exquisite dining, guests can expect a high-class drag cabaret show, where Auckland’s finest join for an unforgettable evening.',
  	"dresscode" varchar DEFAULT 'Your most flamboyant self!',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_performers_performers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_gala_noir_performers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'On stage',
  	"heading" varchar DEFAULT 'Meet the Gala *performers*',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_chefs_chefs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_gala_noir_chefs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'In the kitchen',
  	"heading" varchar DEFAULT 'Meet the Gala *chefs*',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Where the money goes',
  	"heading" varchar DEFAULT 'Why *fundraise*',
  	"body" varchar DEFAULT 'It costs *$300,000 a year* to keep one of our restaurants open — pay-what-you-can contributions bring in around half that. The Gala helps cover rent, kitchen operating costs, supplementary food and the core team behind the scenes. Every dollar raised at the Gala goes back into keeping those doors open. Last year, this room raised over $150,000. This year, with your help, we’re aiming for even more.',
  	"room_seats" numeric DEFAULT 200,
  	"seat_price" numeric DEFAULT 330,
  	"table_price" numeric DEFAULT 3000,
  	"annual_cost" numeric DEFAULT 300000,
  	"room_label" varchar DEFAULT 'The room — 200 seats at St Matthew-in-the-City',
  	"slider_label" varchar DEFAULT 'How many seats will you fill?',
  	"footnote" varchar DEFAULT 'Based on $300,000 a year to run one restaurant. Tables of ten $3,000 · individual seats $330, inclusive of GST.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_tiers_tiers_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_tiers_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tier" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"price" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_gala_noir_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Partnership packages',
  	"heading" varchar DEFAULT 'Sponsor *the Gala*',
  	"body" varchar DEFAULT 'How to put your brand at the centre of Auckland’s most talked-about night — 200 seats, an influential room, genuine connection beyond the reach of advertising alone.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_table_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_caption" varchar DEFAULT 'Images from previous Everybody Eats Galas',
  	"eyebrow" varchar DEFAULT 'Come with friends, whānau or colleagues',
  	"heading" varchar DEFAULT 'Host a *table*',
  	"price" varchar DEFAULT '$3,000',
  	"price_label" varchar DEFAULT 'Table of ten, inclusive of GST',
  	"seat_note" varchar DEFAULT 'Individual tickets $330 on shared tables.',
  	"cta_label" varchar DEFAULT 'Book a table',
  	"secondary_cta_label" varchar DEFAULT 'Individual tickets',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_auction_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_auction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_caption" varchar DEFAULT 'Images from previous Everybody Eats Galas',
  	"eyebrow" varchar DEFAULT 'The heart of the night’s fundraising',
  	"heading" varchar DEFAULT 'Donate items *for auction*',
  	"body" varchar DEFAULT 'Every item donated converts directly into meals served.',
  	"note" varchar DEFAULT '*Auction donations close Tuesday 30 September* — this gives us time to photograph, catalogue and showcase every item at its best. To offer an item, contact Jack at {galaEmail}.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_in_kind_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_in_kind" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'In-kind *donations*',
  	"body" varchar DEFAULT 'Not everything that fuels the night comes as cash. Every bottle, box of produce or gifted service is a dollar redirected from event costs into meals for the community. We welcome wine, beer, spirits and beverages, food and produce for the kitchen, and services such as printing, AV, photography, florals and production.',
  	"note" varchar DEFAULT 'Partnering is simple — tell us what you can offer and we handle the rest. Prefer to give directly? Major gifts and event underwriting make a big difference: talk to Amy at {majorGiftsEmail}.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"major_gifts_email" varchar DEFAULT 'amy@everybodyeats.nz',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"place" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caps_title" varchar DEFAULT 'Proven & unforgettable',
  	"eyebrow" varchar DEFAULT '2022 · 2023 · 2024 — a proven track record',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_closing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"heading" varchar DEFAULT 'Our *work changes lives*',
  	"body" varchar DEFAULT 'We see it every day. We would be honoured to have your support.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"secondary_cta_label" varchar DEFAULT 'everybodyeats.nz',
  	"secondary_cta_url" varchar DEFAULT 'https://everybodyeats.nz',
  	"footer_left" varchar DEFAULT 'The Everybody Eats Gala · Friday 30 October 2026 · St Matthew-in-the-City, Auckland',
  	"footer_right" varchar DEFAULT 'Photography from previous Everybody Eats Galas',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_hero_ribbon" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'Fundraising event — 30 October 2026',
  	"kit_line" varchar DEFAULT 'Event *Sponsorship* Kit',
  	"script_line" varchar DEFAULT 'everybody eats',
  	"word" varchar DEFAULT 'GALA',
  	"intro" varchar DEFAULT 'One audacious night of exquisite dining, high-class drag cabaret and generous bidding — so that everybody eats.',
  	"primary_cta_label" varchar DEFAULT 'Sponsor the Gala',
  	"secondary_cta_label" varchar DEFAULT 'Host a table',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"show_countdown" boolean DEFAULT true,
  	"gala_date_time" timestamp(3) with time zone DEFAULT '2026-10-30T18:30:00+13:00',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_problem_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_problem" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'Why this night matters',
  	"heading" varchar DEFAULT 'The *Problem*',
  	"pull_quote" varchar DEFAULT 'Nearly half — *49%* — of food-insecure households in New Zealand are too ashamed or embarrassed to ask for support.',
  	"sources" varchar DEFAULT 'Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the Environment · Ministry of Health',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_about_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What is *Everybody Eats?*',
  	"tagline" varchar DEFAULT 'Making a difference, one plate at a time.',
  	"body_left" varchar DEFAULT 'Everybody Eats runs charity restaurants which bring communities together through dignified hospitality experiences. With a mission to tackle food waste, food insecurity and social isolation in Aotearoa New Zealand, our teams of hospitality professionals and volunteers rescue and transform surplus food into quality three-course meals, served nightly at our pay-what-you-can restaurants.',
  	"body_right" varchar DEFAULT 'Founded in Auckland in 2017, we have grown from a weekly pop-up on Karangahape Road into a national movement with three permanent restaurants and pop-ups across the motu.',
  	"link_label" varchar DEFAULT 'everybodyeats.nz',
  	"link_url" varchar DEFAULT 'https://everybodyeats.nz',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_night_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_night" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_caption" varchar DEFAULT 'Images from previous Everybody Eats Galas',
  	"eyebrow" varchar DEFAULT 'Friday 30 October 2026 · 6:30pm · St Matthew-in-the-City',
  	"heading" varchar DEFAULT 'An *unforgettable* evening',
  	"body" varchar DEFAULT 'The Everybody Eats Gala is our most audacious fundraising event to date. Alongside exquisite dining, guests can expect a high-class drag cabaret show, where Auckland’s finest join for an unforgettable evening.',
  	"dresscode" varchar DEFAULT 'Your most flamboyant self!',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_performers_performers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_performers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'On stage',
  	"heading" varchar DEFAULT 'Meet the Gala *performers*',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_chefs_chefs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_chefs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'In the kitchen',
  	"heading" varchar DEFAULT 'Meet the Gala *chefs*',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Where the money goes',
  	"heading" varchar DEFAULT 'Why *fundraise*',
  	"body" varchar DEFAULT 'It costs *$300,000 a year* to keep one of our restaurants open — pay-what-you-can contributions bring in around half that. The Gala helps cover rent, kitchen operating costs, supplementary food and the core team behind the scenes. Every dollar raised at the Gala goes back into keeping those doors open. Last year, this room raised over $150,000. This year, with your help, we’re aiming for even more.',
  	"room_seats" numeric DEFAULT 200,
  	"seat_price" numeric DEFAULT 330,
  	"table_price" numeric DEFAULT 3000,
  	"annual_cost" numeric DEFAULT 300000,
  	"room_label" varchar DEFAULT 'The room — 200 seats at St Matthew-in-the-City',
  	"slider_label" varchar DEFAULT 'How many seats will you fill?',
  	"footnote" varchar DEFAULT 'Based on $300,000 a year to run one restaurant. Tables of ten $3,000 · individual seats $330, inclusive of GST.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_tiers_tiers_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_tiers_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tier" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"price" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Partnership packages',
  	"heading" varchar DEFAULT 'Sponsor *the Gala*',
  	"body" varchar DEFAULT 'How to put your brand at the centre of Auckland’s most talked-about night — 200 seats, an influential room, genuine connection beyond the reach of advertising alone.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_table_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_caption" varchar DEFAULT 'Images from previous Everybody Eats Galas',
  	"eyebrow" varchar DEFAULT 'Come with friends, whānau or colleagues',
  	"heading" varchar DEFAULT 'Host a *table*',
  	"price" varchar DEFAULT '$3,000',
  	"price_label" varchar DEFAULT 'Table of ten, inclusive of GST',
  	"seat_note" varchar DEFAULT 'Individual tickets $330 on shared tables.',
  	"cta_label" varchar DEFAULT 'Book a table',
  	"secondary_cta_label" varchar DEFAULT 'Individual tickets',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_auction_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_auction" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_caption" varchar DEFAULT 'Images from previous Everybody Eats Galas',
  	"eyebrow" varchar DEFAULT 'The heart of the night’s fundraising',
  	"heading" varchar DEFAULT 'Donate items *for auction*',
  	"body" varchar DEFAULT 'Every item donated converts directly into meals served.',
  	"note" varchar DEFAULT '*Auction donations close Tuesday 30 September* — this gives us time to photograph, catalogue and showcase every item at its best. To offer an item, contact Jack at {galaEmail}.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_in_kind_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_in_kind" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'In-kind *donations*',
  	"body" varchar DEFAULT 'Not everything that fuels the night comes as cash. Every bottle, box of produce or gifted service is a dollar redirected from event costs into meals for the community. We welcome wine, beer, spirits and beverages, food and produce for the kitchen, and services such as printing, AV, photography, florals and production.',
  	"note" varchar DEFAULT 'Partnering is simple — tell us what you can offer and we handle the rest. Prefer to give directly? Major gifts and event underwriting make a big difference: talk to Amy at {majorGiftsEmail}.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"major_gifts_email" varchar DEFAULT 'amy@everybodyeats.nz',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"place" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caps_title" varchar DEFAULT 'Proven & unforgettable',
  	"eyebrow" varchar DEFAULT '2022 · 2023 · 2024 — a proven track record',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_closing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"heading" varchar DEFAULT 'Our *work changes lives*',
  	"body" varchar DEFAULT 'We see it every day. We would be honoured to have your support.',
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"secondary_cta_label" varchar DEFAULT 'everybodyeats.nz',
  	"secondary_cta_url" varchar DEFAULT 'https://everybodyeats.nz',
  	"footer_left" varchar DEFAULT 'The Everybody Eats Gala · Friday 30 October 2026 · St Matthew-in-the-City, Auckland',
  	"footer_right" varchar DEFAULT 'Photography from previous Everybody Eats Galas',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_gala_noir_hero_ribbon" ADD CONSTRAINT "pages_blocks_gala_noir_hero_ribbon_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_hero" ADD CONSTRAINT "pages_blocks_gala_noir_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_hero" ADD CONSTRAINT "pages_blocks_gala_noir_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_problem_stats" ADD CONSTRAINT "pages_blocks_gala_noir_problem_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_problem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_problem" ADD CONSTRAINT "pages_blocks_gala_noir_problem_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_problem" ADD CONSTRAINT "pages_blocks_gala_noir_problem_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_about_impact_stats" ADD CONSTRAINT "pages_blocks_gala_noir_about_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_about" ADD CONSTRAINT "pages_blocks_gala_noir_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_night_features" ADD CONSTRAINT "pages_blocks_gala_noir_night_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_night"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_night" ADD CONSTRAINT "pages_blocks_gala_noir_night_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_night" ADD CONSTRAINT "pages_blocks_gala_noir_night_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_performers_performers" ADD CONSTRAINT "pages_blocks_gala_noir_performers_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_performers_performers" ADD CONSTRAINT "pages_blocks_gala_noir_performers_performers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_performers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_performers" ADD CONSTRAINT "pages_blocks_gala_noir_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_performers" ADD CONSTRAINT "pages_blocks_gala_noir_performers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_chefs_chefs" ADD CONSTRAINT "pages_blocks_gala_noir_chefs_chefs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_chefs_chefs" ADD CONSTRAINT "pages_blocks_gala_noir_chefs_chefs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_chefs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_chefs" ADD CONSTRAINT "pages_blocks_gala_noir_chefs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_calculator" ADD CONSTRAINT "pages_blocks_gala_noir_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_tiers_tiers_perks" ADD CONSTRAINT "pages_blocks_gala_noir_tiers_tiers_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_tiers_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_tiers_tiers" ADD CONSTRAINT "pages_blocks_gala_noir_tiers_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_tiers" ADD CONSTRAINT "pages_blocks_gala_noir_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_table_includes" ADD CONSTRAINT "pages_blocks_gala_noir_table_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_table" ADD CONSTRAINT "pages_blocks_gala_noir_table_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_table" ADD CONSTRAINT "pages_blocks_gala_noir_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_auction_options" ADD CONSTRAINT "pages_blocks_gala_noir_auction_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_auction"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_auction" ADD CONSTRAINT "pages_blocks_gala_noir_auction_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_auction" ADD CONSTRAINT "pages_blocks_gala_noir_auction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_in_kind_benefits" ADD CONSTRAINT "pages_blocks_gala_noir_in_kind_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_in_kind"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_in_kind" ADD CONSTRAINT "pages_blocks_gala_noir_in_kind_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_quotes_quotes" ADD CONSTRAINT "pages_blocks_gala_noir_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_quotes" ADD CONSTRAINT "pages_blocks_gala_noir_quotes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_quotes" ADD CONSTRAINT "pages_blocks_gala_noir_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_closing" ADD CONSTRAINT "pages_blocks_gala_noir_closing_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_closing" ADD CONSTRAINT "pages_blocks_gala_noir_closing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_hero_ribbon" ADD CONSTRAINT "_pages_v_blocks_gala_noir_hero_ribbon_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_hero" ADD CONSTRAINT "_pages_v_blocks_gala_noir_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_hero" ADD CONSTRAINT "_pages_v_blocks_gala_noir_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_problem_stats" ADD CONSTRAINT "_pages_v_blocks_gala_noir_problem_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_problem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_problem" ADD CONSTRAINT "_pages_v_blocks_gala_noir_problem_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_problem" ADD CONSTRAINT "_pages_v_blocks_gala_noir_problem_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_about_impact_stats" ADD CONSTRAINT "_pages_v_blocks_gala_noir_about_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_about" ADD CONSTRAINT "_pages_v_blocks_gala_noir_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_night_features" ADD CONSTRAINT "_pages_v_blocks_gala_noir_night_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_night"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_night" ADD CONSTRAINT "_pages_v_blocks_gala_noir_night_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_night" ADD CONSTRAINT "_pages_v_blocks_gala_noir_night_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_performers_performers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_performers_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_performers_performers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_performers_performers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_performers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_performers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_performers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_performers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_chefs_chefs" ADD CONSTRAINT "_pages_v_blocks_gala_noir_chefs_chefs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_chefs_chefs" ADD CONSTRAINT "_pages_v_blocks_gala_noir_chefs_chefs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_chefs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_chefs" ADD CONSTRAINT "_pages_v_blocks_gala_noir_chefs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_calculator" ADD CONSTRAINT "_pages_v_blocks_gala_noir_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_tiers_tiers_perks" ADD CONSTRAINT "_pages_v_blocks_gala_noir_tiers_tiers_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_tiers_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_tiers_tiers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_tiers_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_tiers" ADD CONSTRAINT "_pages_v_blocks_gala_noir_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_table_includes" ADD CONSTRAINT "_pages_v_blocks_gala_noir_table_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_table" ADD CONSTRAINT "_pages_v_blocks_gala_noir_table_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_table" ADD CONSTRAINT "_pages_v_blocks_gala_noir_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_auction_options" ADD CONSTRAINT "_pages_v_blocks_gala_noir_auction_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_auction"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_auction" ADD CONSTRAINT "_pages_v_blocks_gala_noir_auction_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_auction" ADD CONSTRAINT "_pages_v_blocks_gala_noir_auction_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_in_kind_benefits" ADD CONSTRAINT "_pages_v_blocks_gala_noir_in_kind_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_in_kind"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_in_kind" ADD CONSTRAINT "_pages_v_blocks_gala_noir_in_kind_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_quotes_quotes" ADD CONSTRAINT "_pages_v_blocks_gala_noir_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_quotes" ADD CONSTRAINT "_pages_v_blocks_gala_noir_quotes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_quotes" ADD CONSTRAINT "_pages_v_blocks_gala_noir_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_closing" ADD CONSTRAINT "_pages_v_blocks_gala_noir_closing_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_closing" ADD CONSTRAINT "_pages_v_blocks_gala_noir_closing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_gala_noir_hero_ribbon_order_idx" ON "pages_blocks_gala_noir_hero_ribbon" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_hero_ribbon_parent_id_idx" ON "pages_blocks_gala_noir_hero_ribbon" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_hero_order_idx" ON "pages_blocks_gala_noir_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_hero_parent_id_idx" ON "pages_blocks_gala_noir_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_hero_path_idx" ON "pages_blocks_gala_noir_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_hero_image_idx" ON "pages_blocks_gala_noir_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_problem_stats_order_idx" ON "pages_blocks_gala_noir_problem_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_problem_stats_parent_id_idx" ON "pages_blocks_gala_noir_problem_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_problem_order_idx" ON "pages_blocks_gala_noir_problem" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_problem_parent_id_idx" ON "pages_blocks_gala_noir_problem" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_problem_path_idx" ON "pages_blocks_gala_noir_problem" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_problem_image_idx" ON "pages_blocks_gala_noir_problem" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_about_impact_stats_order_idx" ON "pages_blocks_gala_noir_about_impact_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_about_impact_stats_parent_id_idx" ON "pages_blocks_gala_noir_about_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_about_order_idx" ON "pages_blocks_gala_noir_about" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_about_parent_id_idx" ON "pages_blocks_gala_noir_about" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_about_path_idx" ON "pages_blocks_gala_noir_about" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_night_features_order_idx" ON "pages_blocks_gala_noir_night_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_night_features_parent_id_idx" ON "pages_blocks_gala_noir_night_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_night_order_idx" ON "pages_blocks_gala_noir_night" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_night_parent_id_idx" ON "pages_blocks_gala_noir_night" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_night_path_idx" ON "pages_blocks_gala_noir_night" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_night_image_idx" ON "pages_blocks_gala_noir_night" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_performers_performers_order_idx" ON "pages_blocks_gala_noir_performers_performers" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_performers_performers_parent_id_idx" ON "pages_blocks_gala_noir_performers_performers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_performers_performers_image_idx" ON "pages_blocks_gala_noir_performers_performers" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_performers_order_idx" ON "pages_blocks_gala_noir_performers" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_performers_parent_id_idx" ON "pages_blocks_gala_noir_performers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_performers_path_idx" ON "pages_blocks_gala_noir_performers" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_performers_image_idx" ON "pages_blocks_gala_noir_performers" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_chefs_chefs_order_idx" ON "pages_blocks_gala_noir_chefs_chefs" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_chefs_chefs_parent_id_idx" ON "pages_blocks_gala_noir_chefs_chefs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_chefs_chefs_image_idx" ON "pages_blocks_gala_noir_chefs_chefs" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_chefs_order_idx" ON "pages_blocks_gala_noir_chefs" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_chefs_parent_id_idx" ON "pages_blocks_gala_noir_chefs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_chefs_path_idx" ON "pages_blocks_gala_noir_chefs" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_calculator_order_idx" ON "pages_blocks_gala_noir_calculator" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_calculator_parent_id_idx" ON "pages_blocks_gala_noir_calculator" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_calculator_path_idx" ON "pages_blocks_gala_noir_calculator" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_tiers_tiers_perks_order_idx" ON "pages_blocks_gala_noir_tiers_tiers_perks" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_tiers_tiers_perks_parent_id_idx" ON "pages_blocks_gala_noir_tiers_tiers_perks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_tiers_tiers_order_idx" ON "pages_blocks_gala_noir_tiers_tiers" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_tiers_tiers_parent_id_idx" ON "pages_blocks_gala_noir_tiers_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_tiers_order_idx" ON "pages_blocks_gala_noir_tiers" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_tiers_parent_id_idx" ON "pages_blocks_gala_noir_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_tiers_path_idx" ON "pages_blocks_gala_noir_tiers" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_table_includes_order_idx" ON "pages_blocks_gala_noir_table_includes" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_table_includes_parent_id_idx" ON "pages_blocks_gala_noir_table_includes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_table_order_idx" ON "pages_blocks_gala_noir_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_table_parent_id_idx" ON "pages_blocks_gala_noir_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_table_path_idx" ON "pages_blocks_gala_noir_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_table_image_idx" ON "pages_blocks_gala_noir_table" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_auction_options_order_idx" ON "pages_blocks_gala_noir_auction_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_auction_options_parent_id_idx" ON "pages_blocks_gala_noir_auction_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_auction_order_idx" ON "pages_blocks_gala_noir_auction" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_auction_parent_id_idx" ON "pages_blocks_gala_noir_auction" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_auction_path_idx" ON "pages_blocks_gala_noir_auction" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_auction_image_idx" ON "pages_blocks_gala_noir_auction" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_in_kind_benefits_order_idx" ON "pages_blocks_gala_noir_in_kind_benefits" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_in_kind_benefits_parent_id_idx" ON "pages_blocks_gala_noir_in_kind_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_in_kind_order_idx" ON "pages_blocks_gala_noir_in_kind" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_in_kind_parent_id_idx" ON "pages_blocks_gala_noir_in_kind" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_in_kind_path_idx" ON "pages_blocks_gala_noir_in_kind" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_quotes_quotes_order_idx" ON "pages_blocks_gala_noir_quotes_quotes" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_quotes_quotes_parent_id_idx" ON "pages_blocks_gala_noir_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_quotes_order_idx" ON "pages_blocks_gala_noir_quotes" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_quotes_parent_id_idx" ON "pages_blocks_gala_noir_quotes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_quotes_path_idx" ON "pages_blocks_gala_noir_quotes" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_quotes_image_idx" ON "pages_blocks_gala_noir_quotes" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_closing_order_idx" ON "pages_blocks_gala_noir_closing" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_closing_parent_id_idx" ON "pages_blocks_gala_noir_closing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_closing_path_idx" ON "pages_blocks_gala_noir_closing" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_closing_image_idx" ON "pages_blocks_gala_noir_closing" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_hero_ribbon_order_idx" ON "_pages_v_blocks_gala_noir_hero_ribbon" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_hero_ribbon_parent_id_idx" ON "_pages_v_blocks_gala_noir_hero_ribbon" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_hero_order_idx" ON "_pages_v_blocks_gala_noir_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_hero_parent_id_idx" ON "_pages_v_blocks_gala_noir_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_hero_path_idx" ON "_pages_v_blocks_gala_noir_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_hero_image_idx" ON "_pages_v_blocks_gala_noir_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_problem_stats_order_idx" ON "_pages_v_blocks_gala_noir_problem_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_problem_stats_parent_id_idx" ON "_pages_v_blocks_gala_noir_problem_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_problem_order_idx" ON "_pages_v_blocks_gala_noir_problem" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_problem_parent_id_idx" ON "_pages_v_blocks_gala_noir_problem" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_problem_path_idx" ON "_pages_v_blocks_gala_noir_problem" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_problem_image_idx" ON "_pages_v_blocks_gala_noir_problem" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_about_impact_stats_order_idx" ON "_pages_v_blocks_gala_noir_about_impact_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_about_impact_stats_parent_id_idx" ON "_pages_v_blocks_gala_noir_about_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_about_order_idx" ON "_pages_v_blocks_gala_noir_about" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_about_parent_id_idx" ON "_pages_v_blocks_gala_noir_about" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_about_path_idx" ON "_pages_v_blocks_gala_noir_about" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_night_features_order_idx" ON "_pages_v_blocks_gala_noir_night_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_night_features_parent_id_idx" ON "_pages_v_blocks_gala_noir_night_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_night_order_idx" ON "_pages_v_blocks_gala_noir_night" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_night_parent_id_idx" ON "_pages_v_blocks_gala_noir_night" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_night_path_idx" ON "_pages_v_blocks_gala_noir_night" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_night_image_idx" ON "_pages_v_blocks_gala_noir_night" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_performers_order_idx" ON "_pages_v_blocks_gala_noir_performers_performers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_performers_parent_id_idx" ON "_pages_v_blocks_gala_noir_performers_performers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_performers_image_idx" ON "_pages_v_blocks_gala_noir_performers_performers" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_order_idx" ON "_pages_v_blocks_gala_noir_performers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_parent_id_idx" ON "_pages_v_blocks_gala_noir_performers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_path_idx" ON "_pages_v_blocks_gala_noir_performers" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_performers_image_idx" ON "_pages_v_blocks_gala_noir_performers" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_chefs_chefs_order_idx" ON "_pages_v_blocks_gala_noir_chefs_chefs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_chefs_chefs_parent_id_idx" ON "_pages_v_blocks_gala_noir_chefs_chefs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_chefs_chefs_image_idx" ON "_pages_v_blocks_gala_noir_chefs_chefs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_chefs_order_idx" ON "_pages_v_blocks_gala_noir_chefs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_chefs_parent_id_idx" ON "_pages_v_blocks_gala_noir_chefs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_chefs_path_idx" ON "_pages_v_blocks_gala_noir_chefs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_calculator_order_idx" ON "_pages_v_blocks_gala_noir_calculator" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_calculator_parent_id_idx" ON "_pages_v_blocks_gala_noir_calculator" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_calculator_path_idx" ON "_pages_v_blocks_gala_noir_calculator" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_tiers_perks_order_idx" ON "_pages_v_blocks_gala_noir_tiers_tiers_perks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_tiers_perks_parent_id_idx" ON "_pages_v_blocks_gala_noir_tiers_tiers_perks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_tiers_order_idx" ON "_pages_v_blocks_gala_noir_tiers_tiers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_tiers_parent_id_idx" ON "_pages_v_blocks_gala_noir_tiers_tiers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_order_idx" ON "_pages_v_blocks_gala_noir_tiers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_parent_id_idx" ON "_pages_v_blocks_gala_noir_tiers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_tiers_path_idx" ON "_pages_v_blocks_gala_noir_tiers" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_table_includes_order_idx" ON "_pages_v_blocks_gala_noir_table_includes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_table_includes_parent_id_idx" ON "_pages_v_blocks_gala_noir_table_includes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_table_order_idx" ON "_pages_v_blocks_gala_noir_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_table_parent_id_idx" ON "_pages_v_blocks_gala_noir_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_table_path_idx" ON "_pages_v_blocks_gala_noir_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_table_image_idx" ON "_pages_v_blocks_gala_noir_table" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_auction_options_order_idx" ON "_pages_v_blocks_gala_noir_auction_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_auction_options_parent_id_idx" ON "_pages_v_blocks_gala_noir_auction_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_auction_order_idx" ON "_pages_v_blocks_gala_noir_auction" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_auction_parent_id_idx" ON "_pages_v_blocks_gala_noir_auction" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_auction_path_idx" ON "_pages_v_blocks_gala_noir_auction" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_auction_image_idx" ON "_pages_v_blocks_gala_noir_auction" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_in_kind_benefits_order_idx" ON "_pages_v_blocks_gala_noir_in_kind_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_in_kind_benefits_parent_id_idx" ON "_pages_v_blocks_gala_noir_in_kind_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_in_kind_order_idx" ON "_pages_v_blocks_gala_noir_in_kind" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_in_kind_parent_id_idx" ON "_pages_v_blocks_gala_noir_in_kind" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_in_kind_path_idx" ON "_pages_v_blocks_gala_noir_in_kind" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_quotes_quotes_order_idx" ON "_pages_v_blocks_gala_noir_quotes_quotes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_quotes_quotes_parent_id_idx" ON "_pages_v_blocks_gala_noir_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_quotes_order_idx" ON "_pages_v_blocks_gala_noir_quotes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_quotes_parent_id_idx" ON "_pages_v_blocks_gala_noir_quotes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_quotes_path_idx" ON "_pages_v_blocks_gala_noir_quotes" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_quotes_image_idx" ON "_pages_v_blocks_gala_noir_quotes" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_closing_order_idx" ON "_pages_v_blocks_gala_noir_closing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_closing_parent_id_idx" ON "_pages_v_blocks_gala_noir_closing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_closing_path_idx" ON "_pages_v_blocks_gala_noir_closing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_closing_image_idx" ON "_pages_v_blocks_gala_noir_closing" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_gala_noir_hero_ribbon" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_hero" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_problem_stats" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_problem" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_about_impact_stats" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_about" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_night_features" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_night" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_performers_performers" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_performers" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_chefs_chefs" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_chefs" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_calculator" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_tiers_tiers_perks" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_tiers_tiers" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_tiers" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_table_includes" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_table" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_auction_options" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_auction" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_in_kind_benefits" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_in_kind" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_quotes_quotes" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_quotes" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_closing" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_hero_ribbon" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_problem_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_problem" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_about_impact_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_about" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_night_features" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_night" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_performers_performers" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_performers" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_chefs_chefs" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_chefs" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_calculator" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_tiers_tiers_perks" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_tiers_tiers" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_tiers" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_table_includes" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_table" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_auction_options" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_auction" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_in_kind_benefits" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_in_kind" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_quotes_quotes" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_quotes" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_closing" CASCADE;`)
}
