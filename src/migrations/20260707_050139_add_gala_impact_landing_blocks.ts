import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_gala_landing_night_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_problem_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_performers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_gala_landing_chefs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"location" varchar,
  	"bio" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_gala_landing_tiers_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"price" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_table_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_auction_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_partnership" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"place" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing_money_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_landing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"major_gifts_email" varchar DEFAULT 'amy@everybodyeats.nz',
  	"gala_date_time" timestamp(3) with time zone DEFAULT '2026-10-30T18:30:00+13:00',
  	"hero_image_id" integer,
  	"hero_eyebrow" varchar DEFAULT 'Fundraising Gala · Auckland',
  	"hero_heading_before" varchar DEFAULT 'The ',
  	"hero_heading_highlight" varchar DEFAULT 'Everybody Eats',
  	"hero_heading_after" varchar DEFAULT ' Gala',
  	"hero_intro" varchar DEFAULT 'Auckland trades the boardroom for the ballroom — a high-class drag cabaret evening in support of dignity on every plate.',
  	"hero_date" varchar DEFAULT 'Friday 30 October 2026',
  	"hero_location" varchar DEFAULT 'St Matthew-in-the-City, Auckland CBD',
  	"hero_primary_cta_label" varchar DEFAULT 'Host a table',
  	"hero_secondary_cta_label" varchar DEFAULT 'Become a sponsor',
  	"night_eyebrow" varchar DEFAULT 'The night',
  	"night_heading" varchar DEFAULT 'Our most *audacious* evening of the year',
  	"night_body" varchar DEFAULT 'The Everybody Eats Gala is our most audacious fundraising event — and this year, guests can expect a high-class drag cabaret evening where Auckland’s most influential names trade the boardroom for the ballroom.',
  	"night_image_id" integer,
  	"problem_eyebrow" varchar DEFAULT 'The problem',
  	"problem_heading" varchar DEFAULT 'Hunger in Aotearoa is closer than most of us think',
  	"problem_footnote" varchar DEFAULT 'At the same time, 1.22 million tonnes of food are lost or wasted across the supply chain each year — 237 kg for every person in the country. Having a job is no longer a shield.',
  	"problem_sources" varchar DEFAULT 'Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the Environment · Ministry of Health',
  	"who_eyebrow" varchar DEFAULT 'Who is Everybody Eats',
  	"who_heading" varchar DEFAULT 'A social enterprise turning rescued food into restaurant-quality, pay-what-you-can meals — served with *dignity*, no questions asked.',
  	"who_body" varchar DEFAULT 'Founded in Auckland in 2017, we’ve grown from a single Monday-night pop-up into three permanent restaurants and nationwide pop-ups, built on manaakitanga, kaitiakitanga and whanaungatanga. Every service tackles three problems at once — food waste, food insecurity and social isolation — and proves dignity doesn’t have to cost more.',
  	"performers_eyebrow" varchar DEFAULT 'Meet the performers',
  	"performers_heading" varchar DEFAULT 'The stars of the *cabaret*',
  	"chefs_eyebrow" varchar DEFAULT 'Meet the chefs',
  	"chefs_heading" varchar DEFAULT 'Three courses, cooked with *heart*',
  	"sponsor_eyebrow" varchar DEFAULT 'Get involved · Headline the Gala',
  	"sponsor_heading" varchar DEFAULT 'Put your brand at the *centre* of the night',
  	"sponsor_body" varchar DEFAULT 'Two ways to headline Auckland’s most talked-about evening — a room of just 200 decision-makers, business leaders, philanthropists and tastemakers you can’t buy your way into with ad spend.',
  	"table_image_id" integer,
  	"table_eyebrow" varchar DEFAULT 'Host a table',
  	"table_heading" varchar DEFAULT 'Bring your team. Host your clients.',
  	"table_body" varchar DEFAULT 'Reserve a table of ten in a room of just 200 — the kind of night your guests talk about long afterwards.',
  	"table_price" varchar DEFAULT '$3,000',
  	"table_price_label" varchar DEFAULT 'per table of ten',
  	"seat_price" varchar DEFAULT '$320',
  	"seat_price_label" varchar DEFAULT 'individual seat',
  	"table_cta_label" varchar DEFAULT 'Reserve your table',
  	"auction_eyebrow" varchar DEFAULT 'Donate items for auction',
  	"auction_heading" varchar DEFAULT 'The auction is the *heart* of the night',
  	"auction_body" varchar DEFAULT 'Every item donated converts directly into meals served, and your generosity is named to a room of 200 of Auckland’s most influential guests.',
  	"in_kind_eyebrow" varchar DEFAULT 'In-kind donations',
  	"in_kind_heading" varchar DEFAULT 'Pour into the night',
  	"in_kind_body" varchar DEFAULT 'Not everything that fuels the night comes as cash. Every bottle of wine, beer or spirits, every box of produce for the kitchen, every gifted service — printing, AV, photography, florals — is a dollar that goes to feeding people instead of running the event. We name your generosity in the room and in the programme.',
  	"in_kind_cta_label" varchar DEFAULT 'Offer an in-kind gift',
  	"major_gifts_note" varchar DEFAULT 'Prefer to give directly? Major gifts and event underwriting make the biggest single difference of all — talk to Amy at {majorGiftsEmail}.',
  	"partnership_eyebrow" varchar DEFAULT 'What your partnership gives you',
  	"partnership_heading" varchar DEFAULT 'Support that *defends itself*',
  	"partnership_body" varchar DEFAULT 'Your support converts straight into outcomes your board and ESG reporting can use: meals served with dignity, kilograms diverted from landfill, emissions avoided, community hours mobilised. We give you the figures and the human story behind them.',
  	"partnership_note" varchar DEFAULT 'Partnering is simple — tell us what you can offer and we handle the rest, from listing to delivery on the night. Donations close *Tuesday 30 September*, giving us time to photograph, catalogue and showcase every item at its best. To offer an item, contact Jack at {galaEmail}.',
  	"quotes_eyebrow" varchar DEFAULT 'Proven & unforgettable',
  	"quotes_heading" varchar DEFAULT 'A certified *can’t-miss* hoot',
  	"money_image_id" integer,
  	"money_eyebrow" varchar DEFAULT 'Where the money goes',
  	"money_heading" varchar DEFAULT 'Every dollar keeps the *doors open*',
  	"money_body" varchar DEFAULT 'It costs $300,000 a year to keep one of our restaurants open — the rent, the kitchen, the food, the core team, the doors that stay open to anyone who walks in. Every dollar raised at the Gala goes straight back into keeping those doors open.',
  	"closing_image_id" integer,
  	"closing_eyebrow" varchar DEFAULT 'Get in touch',
  	"closing_heading" varchar DEFAULT 'Our work changes lives. We see it *every day.*',
  	"closing_body" varchar DEFAULT 'We would be honoured to have your support on Friday 30 October. Host a table, headline the night, or donate to the auction — every gesture feeds people with dignity, long after the night ends.',
  	"closing_secondary_cta_label" varchar DEFAULT 'everybodyeats.nz',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_impact_landing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_prefix" varchar DEFAULT 'Everybody Eats',
  	"heading" varchar DEFAULT 'Everybody got *a seat.*',
  	"intro" varchar DEFAULT 'Six years ago we set one long table and asked people to pay what they feel. Since then, {meals} dinners have been served from rescued food — no one turned away, everyone welcome. Here’s the story in numbers.',
  	"stat_meals_label" varchar DEFAULT 'meals served',
  	"stat_food_label" varchar DEFAULT 'food rescued',
  	"stat_volunteers_label" varchar DEFAULT 'volunteers welcomed',
  	"stat_koha_label" varchar DEFAULT 'given back in koha',
  	"pay_eyebrow" varchar DEFAULT 'Pay as you feel',
  	"pay_heading" varchar DEFAULT 'Everyone eats. *However* much you can give.',
  	"pay_body" varchar DEFAULT 'There’s no price on the menu. Some pay it forward so the next person can eat; some sit down as our guests — no questions asked. Drag through the years and watch a typical table of 100 change.',
  	"growth_eyebrow" varchar DEFAULT 'More neighbours, every year',
  	"growth_heading" varchar DEFAULT 'A table that keeps *growing.*',
  	"growth_body" varchar DEFAULT 'From a single pop-up dinner to a standing welcome across three cities — the number of meals served has climbed year on year as more neighbours find a seat.',
  	"growth_caption" varchar DEFAULT 'Meals served per year. {firstYear} and the current year are partial (marked *).',
  	"rescued_eyebrow" varchar DEFAULT 'Good food, not landfill',
  	"rescued_heading" varchar DEFAULT 'Every plate starts as *rescued* food.',
  	"rescued_body" varchar DEFAULT 'Our kitchens take surplus ingredients that would otherwise be thrown away and turn them into restaurant-quality meals. Good food finds a plate instead of a bin.',
  	"rescued_tonnes_label" varchar DEFAULT 'of food rescued from landfill',
  	"rescued_meals_label" varchar DEFAULT 'meals cooked from that surplus',
  	"venues_eyebrow" varchar DEFAULT 'Where we serve',
  	"venues_heading" varchar DEFAULT 'Three cities, one *open* table.',
  	"venues_body" varchar DEFAULT 'From Onehunga to Wellington, every location runs the same welcome — a warm room, a good meal, and a seat for whoever walks in.',
  	"people_eyebrow" varchar DEFAULT 'The people who show up',
  	"people_heading" varchar DEFAULT 'Every plate is carried by a *volunteer.*',
  	"people_volunteers_label" varchar DEFAULT 'volunteers in the door',
  	"people_hours_label" varchar DEFAULT 'hours given',
  	"people_nights_label" varchar DEFAULT 'nights cooked & served',
  	"people_guests_label" varchar DEFAULT 'ate as our guests',
  	"people_subheading" varchar DEFAULT 'The regulars who keep coming back.',
  	"people_subbody" varchar DEFAULT 'Most volunteers start with a single shift — and then they keep showing up. Here’s how many have served each milestone of nights.',
  	"cta_heading" varchar DEFAULT 'Pull up *a chair.*',
  	"cta_body" varchar DEFAULT 'Come for dinner and pay what you feel — or join the team that makes every night happen.',
  	"cta_primary_label" varchar DEFAULT 'Find a dinner',
  	"cta_secondary_label" varchar DEFAULT 'Volunteer with us',
  	"footer_note" varchar DEFAULT 'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Paid it forward” and “ate as our guests” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_night_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_problem_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_performers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_chefs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"location" varchar,
  	"bio" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_tiers_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"price" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_table_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_auction_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_partnership" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"place" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing_money_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_landing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gala_email" varchar DEFAULT 'gala@everybodyeats.nz',
  	"major_gifts_email" varchar DEFAULT 'amy@everybodyeats.nz',
  	"gala_date_time" timestamp(3) with time zone DEFAULT '2026-10-30T18:30:00+13:00',
  	"hero_image_id" integer,
  	"hero_eyebrow" varchar DEFAULT 'Fundraising Gala · Auckland',
  	"hero_heading_before" varchar DEFAULT 'The ',
  	"hero_heading_highlight" varchar DEFAULT 'Everybody Eats',
  	"hero_heading_after" varchar DEFAULT ' Gala',
  	"hero_intro" varchar DEFAULT 'Auckland trades the boardroom for the ballroom — a high-class drag cabaret evening in support of dignity on every plate.',
  	"hero_date" varchar DEFAULT 'Friday 30 October 2026',
  	"hero_location" varchar DEFAULT 'St Matthew-in-the-City, Auckland CBD',
  	"hero_primary_cta_label" varchar DEFAULT 'Host a table',
  	"hero_secondary_cta_label" varchar DEFAULT 'Become a sponsor',
  	"night_eyebrow" varchar DEFAULT 'The night',
  	"night_heading" varchar DEFAULT 'Our most *audacious* evening of the year',
  	"night_body" varchar DEFAULT 'The Everybody Eats Gala is our most audacious fundraising event — and this year, guests can expect a high-class drag cabaret evening where Auckland’s most influential names trade the boardroom for the ballroom.',
  	"night_image_id" integer,
  	"problem_eyebrow" varchar DEFAULT 'The problem',
  	"problem_heading" varchar DEFAULT 'Hunger in Aotearoa is closer than most of us think',
  	"problem_footnote" varchar DEFAULT 'At the same time, 1.22 million tonnes of food are lost or wasted across the supply chain each year — 237 kg for every person in the country. Having a job is no longer a shield.',
  	"problem_sources" varchar DEFAULT 'Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the Environment · Ministry of Health',
  	"who_eyebrow" varchar DEFAULT 'Who is Everybody Eats',
  	"who_heading" varchar DEFAULT 'A social enterprise turning rescued food into restaurant-quality, pay-what-you-can meals — served with *dignity*, no questions asked.',
  	"who_body" varchar DEFAULT 'Founded in Auckland in 2017, we’ve grown from a single Monday-night pop-up into three permanent restaurants and nationwide pop-ups, built on manaakitanga, kaitiakitanga and whanaungatanga. Every service tackles three problems at once — food waste, food insecurity and social isolation — and proves dignity doesn’t have to cost more.',
  	"performers_eyebrow" varchar DEFAULT 'Meet the performers',
  	"performers_heading" varchar DEFAULT 'The stars of the *cabaret*',
  	"chefs_eyebrow" varchar DEFAULT 'Meet the chefs',
  	"chefs_heading" varchar DEFAULT 'Three courses, cooked with *heart*',
  	"sponsor_eyebrow" varchar DEFAULT 'Get involved · Headline the Gala',
  	"sponsor_heading" varchar DEFAULT 'Put your brand at the *centre* of the night',
  	"sponsor_body" varchar DEFAULT 'Two ways to headline Auckland’s most talked-about evening — a room of just 200 decision-makers, business leaders, philanthropists and tastemakers you can’t buy your way into with ad spend.',
  	"table_image_id" integer,
  	"table_eyebrow" varchar DEFAULT 'Host a table',
  	"table_heading" varchar DEFAULT 'Bring your team. Host your clients.',
  	"table_body" varchar DEFAULT 'Reserve a table of ten in a room of just 200 — the kind of night your guests talk about long afterwards.',
  	"table_price" varchar DEFAULT '$3,000',
  	"table_price_label" varchar DEFAULT 'per table of ten',
  	"seat_price" varchar DEFAULT '$320',
  	"seat_price_label" varchar DEFAULT 'individual seat',
  	"table_cta_label" varchar DEFAULT 'Reserve your table',
  	"auction_eyebrow" varchar DEFAULT 'Donate items for auction',
  	"auction_heading" varchar DEFAULT 'The auction is the *heart* of the night',
  	"auction_body" varchar DEFAULT 'Every item donated converts directly into meals served, and your generosity is named to a room of 200 of Auckland’s most influential guests.',
  	"in_kind_eyebrow" varchar DEFAULT 'In-kind donations',
  	"in_kind_heading" varchar DEFAULT 'Pour into the night',
  	"in_kind_body" varchar DEFAULT 'Not everything that fuels the night comes as cash. Every bottle of wine, beer or spirits, every box of produce for the kitchen, every gifted service — printing, AV, photography, florals — is a dollar that goes to feeding people instead of running the event. We name your generosity in the room and in the programme.',
  	"in_kind_cta_label" varchar DEFAULT 'Offer an in-kind gift',
  	"major_gifts_note" varchar DEFAULT 'Prefer to give directly? Major gifts and event underwriting make the biggest single difference of all — talk to Amy at {majorGiftsEmail}.',
  	"partnership_eyebrow" varchar DEFAULT 'What your partnership gives you',
  	"partnership_heading" varchar DEFAULT 'Support that *defends itself*',
  	"partnership_body" varchar DEFAULT 'Your support converts straight into outcomes your board and ESG reporting can use: meals served with dignity, kilograms diverted from landfill, emissions avoided, community hours mobilised. We give you the figures and the human story behind them.',
  	"partnership_note" varchar DEFAULT 'Partnering is simple — tell us what you can offer and we handle the rest, from listing to delivery on the night. Donations close *Tuesday 30 September*, giving us time to photograph, catalogue and showcase every item at its best. To offer an item, contact Jack at {galaEmail}.',
  	"quotes_eyebrow" varchar DEFAULT 'Proven & unforgettable',
  	"quotes_heading" varchar DEFAULT 'A certified *can’t-miss* hoot',
  	"money_image_id" integer,
  	"money_eyebrow" varchar DEFAULT 'Where the money goes',
  	"money_heading" varchar DEFAULT 'Every dollar keeps the *doors open*',
  	"money_body" varchar DEFAULT 'It costs $300,000 a year to keep one of our restaurants open — the rent, the kitchen, the food, the core team, the doors that stay open to anyone who walks in. Every dollar raised at the Gala goes straight back into keeping those doors open.',
  	"closing_image_id" integer,
  	"closing_eyebrow" varchar DEFAULT 'Get in touch',
  	"closing_heading" varchar DEFAULT 'Our work changes lives. We see it *every day.*',
  	"closing_body" varchar DEFAULT 'We would be honoured to have your support on Friday 30 October. Host a table, headline the night, or donate to the auction — every gesture feeds people with dignity, long after the night ends.',
  	"closing_secondary_cta_label" varchar DEFAULT 'everybodyeats.nz',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_impact_landing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow_prefix" varchar DEFAULT 'Everybody Eats',
  	"heading" varchar DEFAULT 'Everybody got *a seat.*',
  	"intro" varchar DEFAULT 'Six years ago we set one long table and asked people to pay what they feel. Since then, {meals} dinners have been served from rescued food — no one turned away, everyone welcome. Here’s the story in numbers.',
  	"stat_meals_label" varchar DEFAULT 'meals served',
  	"stat_food_label" varchar DEFAULT 'food rescued',
  	"stat_volunteers_label" varchar DEFAULT 'volunteers welcomed',
  	"stat_koha_label" varchar DEFAULT 'given back in koha',
  	"pay_eyebrow" varchar DEFAULT 'Pay as you feel',
  	"pay_heading" varchar DEFAULT 'Everyone eats. *However* much you can give.',
  	"pay_body" varchar DEFAULT 'There’s no price on the menu. Some pay it forward so the next person can eat; some sit down as our guests — no questions asked. Drag through the years and watch a typical table of 100 change.',
  	"growth_eyebrow" varchar DEFAULT 'More neighbours, every year',
  	"growth_heading" varchar DEFAULT 'A table that keeps *growing.*',
  	"growth_body" varchar DEFAULT 'From a single pop-up dinner to a standing welcome across three cities — the number of meals served has climbed year on year as more neighbours find a seat.',
  	"growth_caption" varchar DEFAULT 'Meals served per year. {firstYear} and the current year are partial (marked *).',
  	"rescued_eyebrow" varchar DEFAULT 'Good food, not landfill',
  	"rescued_heading" varchar DEFAULT 'Every plate starts as *rescued* food.',
  	"rescued_body" varchar DEFAULT 'Our kitchens take surplus ingredients that would otherwise be thrown away and turn them into restaurant-quality meals. Good food finds a plate instead of a bin.',
  	"rescued_tonnes_label" varchar DEFAULT 'of food rescued from landfill',
  	"rescued_meals_label" varchar DEFAULT 'meals cooked from that surplus',
  	"venues_eyebrow" varchar DEFAULT 'Where we serve',
  	"venues_heading" varchar DEFAULT 'Three cities, one *open* table.',
  	"venues_body" varchar DEFAULT 'From Onehunga to Wellington, every location runs the same welcome — a warm room, a good meal, and a seat for whoever walks in.',
  	"people_eyebrow" varchar DEFAULT 'The people who show up',
  	"people_heading" varchar DEFAULT 'Every plate is carried by a *volunteer.*',
  	"people_volunteers_label" varchar DEFAULT 'volunteers in the door',
  	"people_hours_label" varchar DEFAULT 'hours given',
  	"people_nights_label" varchar DEFAULT 'nights cooked & served',
  	"people_guests_label" varchar DEFAULT 'ate as our guests',
  	"people_subheading" varchar DEFAULT 'The regulars who keep coming back.',
  	"people_subbody" varchar DEFAULT 'Most volunteers start with a single shift — and then they keep showing up. Here’s how many have served each milestone of nights.',
  	"cta_heading" varchar DEFAULT 'Pull up *a chair.*',
  	"cta_body" varchar DEFAULT 'Come for dinner and pay what you feel — or join the team that makes every night happen.',
  	"cta_primary_label" varchar DEFAULT 'Find a dinner',
  	"cta_secondary_label" varchar DEFAULT 'Volunteer with us',
  	"footer_note" varchar DEFAULT 'Figures are drawn from Everybody Eats’ service records across {nights} dinners {range} and refresh automatically. Food rescued is estimated at {perMeal} kg per meal served. The opening and current years are partial. “Paid it forward” and “ate as our guests” reflect how many diners chose to leave koha on a typical night — everyone is welcome either way.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
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
  ALTER TABLE "locations" ALTER COLUMN "open_status" DROP DEFAULT;
  ALTER TABLE "_locations_v" ALTER COLUMN "version_open_status" DROP DEFAULT;
  ALTER TABLE "pages_blocks_gala_landing_night_list" ADD CONSTRAINT "pages_blocks_gala_landing_night_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_problem_stats" ADD CONSTRAINT "pages_blocks_gala_landing_problem_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_impact_stats" ADD CONSTRAINT "pages_blocks_gala_landing_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_performers" ADD CONSTRAINT "pages_blocks_gala_landing_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_performers" ADD CONSTRAINT "pages_blocks_gala_landing_performers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_chefs" ADD CONSTRAINT "pages_blocks_gala_landing_chefs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_chefs" ADD CONSTRAINT "pages_blocks_gala_landing_chefs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_tiers_includes" ADD CONSTRAINT "pages_blocks_gala_landing_tiers_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_tiers" ADD CONSTRAINT "pages_blocks_gala_landing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_table_list" ADD CONSTRAINT "pages_blocks_gala_landing_table_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_auction_options" ADD CONSTRAINT "pages_blocks_gala_landing_auction_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_partnership" ADD CONSTRAINT "pages_blocks_gala_landing_partnership_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_quotes" ADD CONSTRAINT "pages_blocks_gala_landing_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing_money_cards" ADD CONSTRAINT "pages_blocks_gala_landing_money_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing" ADD CONSTRAINT "pages_blocks_gala_landing_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing" ADD CONSTRAINT "pages_blocks_gala_landing_night_image_id_media_id_fk" FOREIGN KEY ("night_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing" ADD CONSTRAINT "pages_blocks_gala_landing_table_image_id_media_id_fk" FOREIGN KEY ("table_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing" ADD CONSTRAINT "pages_blocks_gala_landing_money_image_id_media_id_fk" FOREIGN KEY ("money_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing" ADD CONSTRAINT "pages_blocks_gala_landing_closing_image_id_media_id_fk" FOREIGN KEY ("closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_landing" ADD CONSTRAINT "pages_blocks_gala_landing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_impact_landing" ADD CONSTRAINT "pages_blocks_impact_landing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_night_list" ADD CONSTRAINT "_pages_v_blocks_gala_landing_night_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_problem_stats" ADD CONSTRAINT "_pages_v_blocks_gala_landing_problem_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_impact_stats" ADD CONSTRAINT "_pages_v_blocks_gala_landing_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_performers" ADD CONSTRAINT "_pages_v_blocks_gala_landing_performers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_performers" ADD CONSTRAINT "_pages_v_blocks_gala_landing_performers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_chefs" ADD CONSTRAINT "_pages_v_blocks_gala_landing_chefs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_chefs" ADD CONSTRAINT "_pages_v_blocks_gala_landing_chefs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_tiers_includes" ADD CONSTRAINT "_pages_v_blocks_gala_landing_tiers_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_tiers" ADD CONSTRAINT "_pages_v_blocks_gala_landing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_table_list" ADD CONSTRAINT "_pages_v_blocks_gala_landing_table_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_auction_options" ADD CONSTRAINT "_pages_v_blocks_gala_landing_auction_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_partnership" ADD CONSTRAINT "_pages_v_blocks_gala_landing_partnership_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_quotes" ADD CONSTRAINT "_pages_v_blocks_gala_landing_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing_money_cards" ADD CONSTRAINT "_pages_v_blocks_gala_landing_money_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing" ADD CONSTRAINT "_pages_v_blocks_gala_landing_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing" ADD CONSTRAINT "_pages_v_blocks_gala_landing_night_image_id_media_id_fk" FOREIGN KEY ("night_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing" ADD CONSTRAINT "_pages_v_blocks_gala_landing_table_image_id_media_id_fk" FOREIGN KEY ("table_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing" ADD CONSTRAINT "_pages_v_blocks_gala_landing_money_image_id_media_id_fk" FOREIGN KEY ("money_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing" ADD CONSTRAINT "_pages_v_blocks_gala_landing_closing_image_id_media_id_fk" FOREIGN KEY ("closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_landing" ADD CONSTRAINT "_pages_v_blocks_gala_landing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_impact_landing" ADD CONSTRAINT "_pages_v_blocks_impact_landing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_gala_landing_night_list_order_idx" ON "pages_blocks_gala_landing_night_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_night_list_parent_id_idx" ON "pages_blocks_gala_landing_night_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_problem_stats_order_idx" ON "pages_blocks_gala_landing_problem_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_problem_stats_parent_id_idx" ON "pages_blocks_gala_landing_problem_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_impact_stats_order_idx" ON "pages_blocks_gala_landing_impact_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_impact_stats_parent_id_idx" ON "pages_blocks_gala_landing_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_performers_order_idx" ON "pages_blocks_gala_landing_performers" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_performers_parent_id_idx" ON "pages_blocks_gala_landing_performers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_performers_image_idx" ON "pages_blocks_gala_landing_performers" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_landing_chefs_order_idx" ON "pages_blocks_gala_landing_chefs" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_chefs_parent_id_idx" ON "pages_blocks_gala_landing_chefs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_chefs_image_idx" ON "pages_blocks_gala_landing_chefs" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_landing_tiers_includes_order_idx" ON "pages_blocks_gala_landing_tiers_includes" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_tiers_includes_parent_id_idx" ON "pages_blocks_gala_landing_tiers_includes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_tiers_order_idx" ON "pages_blocks_gala_landing_tiers" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_tiers_parent_id_idx" ON "pages_blocks_gala_landing_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_table_list_order_idx" ON "pages_blocks_gala_landing_table_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_table_list_parent_id_idx" ON "pages_blocks_gala_landing_table_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_auction_options_order_idx" ON "pages_blocks_gala_landing_auction_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_auction_options_parent_id_idx" ON "pages_blocks_gala_landing_auction_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_partnership_order_idx" ON "pages_blocks_gala_landing_partnership" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_partnership_parent_id_idx" ON "pages_blocks_gala_landing_partnership" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_quotes_order_idx" ON "pages_blocks_gala_landing_quotes" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_quotes_parent_id_idx" ON "pages_blocks_gala_landing_quotes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_money_cards_order_idx" ON "pages_blocks_gala_landing_money_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_money_cards_parent_id_idx" ON "pages_blocks_gala_landing_money_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_order_idx" ON "pages_blocks_gala_landing" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_landing_parent_id_idx" ON "pages_blocks_gala_landing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_landing_path_idx" ON "pages_blocks_gala_landing" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_landing_hero_image_idx" ON "pages_blocks_gala_landing" USING btree ("hero_image_id");
  CREATE INDEX "pages_blocks_gala_landing_night_image_idx" ON "pages_blocks_gala_landing" USING btree ("night_image_id");
  CREATE INDEX "pages_blocks_gala_landing_table_image_idx" ON "pages_blocks_gala_landing" USING btree ("table_image_id");
  CREATE INDEX "pages_blocks_gala_landing_money_image_idx" ON "pages_blocks_gala_landing" USING btree ("money_image_id");
  CREATE INDEX "pages_blocks_gala_landing_closing_image_idx" ON "pages_blocks_gala_landing" USING btree ("closing_image_id");
  CREATE INDEX "pages_blocks_impact_landing_order_idx" ON "pages_blocks_impact_landing" USING btree ("_order");
  CREATE INDEX "pages_blocks_impact_landing_parent_id_idx" ON "pages_blocks_impact_landing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_impact_landing_path_idx" ON "pages_blocks_impact_landing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_landing_night_list_order_idx" ON "_pages_v_blocks_gala_landing_night_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_night_list_parent_id_idx" ON "_pages_v_blocks_gala_landing_night_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_problem_stats_order_idx" ON "_pages_v_blocks_gala_landing_problem_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_problem_stats_parent_id_idx" ON "_pages_v_blocks_gala_landing_problem_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_impact_stats_order_idx" ON "_pages_v_blocks_gala_landing_impact_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_impact_stats_parent_id_idx" ON "_pages_v_blocks_gala_landing_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_performers_order_idx" ON "_pages_v_blocks_gala_landing_performers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_performers_parent_id_idx" ON "_pages_v_blocks_gala_landing_performers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_performers_image_idx" ON "_pages_v_blocks_gala_landing_performers" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_chefs_order_idx" ON "_pages_v_blocks_gala_landing_chefs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_chefs_parent_id_idx" ON "_pages_v_blocks_gala_landing_chefs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_chefs_image_idx" ON "_pages_v_blocks_gala_landing_chefs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_tiers_includes_order_idx" ON "_pages_v_blocks_gala_landing_tiers_includes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_tiers_includes_parent_id_idx" ON "_pages_v_blocks_gala_landing_tiers_includes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_tiers_order_idx" ON "_pages_v_blocks_gala_landing_tiers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_tiers_parent_id_idx" ON "_pages_v_blocks_gala_landing_tiers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_table_list_order_idx" ON "_pages_v_blocks_gala_landing_table_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_table_list_parent_id_idx" ON "_pages_v_blocks_gala_landing_table_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_auction_options_order_idx" ON "_pages_v_blocks_gala_landing_auction_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_auction_options_parent_id_idx" ON "_pages_v_blocks_gala_landing_auction_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_partnership_order_idx" ON "_pages_v_blocks_gala_landing_partnership" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_partnership_parent_id_idx" ON "_pages_v_blocks_gala_landing_partnership" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_quotes_order_idx" ON "_pages_v_blocks_gala_landing_quotes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_quotes_parent_id_idx" ON "_pages_v_blocks_gala_landing_quotes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_money_cards_order_idx" ON "_pages_v_blocks_gala_landing_money_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_money_cards_parent_id_idx" ON "_pages_v_blocks_gala_landing_money_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_order_idx" ON "_pages_v_blocks_gala_landing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_landing_parent_id_idx" ON "_pages_v_blocks_gala_landing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_path_idx" ON "_pages_v_blocks_gala_landing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_landing_hero_image_idx" ON "_pages_v_blocks_gala_landing" USING btree ("hero_image_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_night_image_idx" ON "_pages_v_blocks_gala_landing" USING btree ("night_image_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_table_image_idx" ON "_pages_v_blocks_gala_landing" USING btree ("table_image_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_money_image_idx" ON "_pages_v_blocks_gala_landing" USING btree ("money_image_id");
  CREATE INDEX "_pages_v_blocks_gala_landing_closing_image_idx" ON "_pages_v_blocks_gala_landing" USING btree ("closing_image_id");
  CREATE INDEX "_pages_v_blocks_impact_landing_order_idx" ON "_pages_v_blocks_impact_landing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_impact_landing_parent_id_idx" ON "_pages_v_blocks_impact_landing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_impact_landing_path_idx" ON "_pages_v_blocks_impact_landing" USING btree ("_path");
  ALTER TABLE "pages" DROP COLUMN "updated_by_id";
  ALTER TABLE "pages" DROP COLUMN "created_by_id";
  ALTER TABLE "pages" DROP COLUMN "published_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_published_by_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gala_landing_night_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_problem_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_impact_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_performers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_chefs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_tiers_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_table_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_auction_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_partnership" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing_money_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gala_landing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_impact_landing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_night_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_problem_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_impact_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_performers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_chefs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_tiers_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_table_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_auction_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_partnership" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing_money_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gala_landing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_impact_landing" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_gala_landing_night_list" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_problem_stats" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_impact_stats" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_performers" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_chefs" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_tiers_includes" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_tiers" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_table_list" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_auction_options" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_partnership" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_quotes" CASCADE;
  DROP TABLE "pages_blocks_gala_landing_money_cards" CASCADE;
  DROP TABLE "pages_blocks_gala_landing" CASCADE;
  DROP TABLE "pages_blocks_impact_landing" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_night_list" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_problem_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_impact_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_performers" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_chefs" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_tiers_includes" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_tiers" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_table_list" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_auction_options" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_partnership" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_quotes" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing_money_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_landing" CASCADE;
  DROP TABLE "_pages_v_blocks_impact_landing" CASCADE;
  ALTER TABLE "locations" ALTER COLUMN "open_status" SET DEFAULT 'open';
  ALTER TABLE "_locations_v" ALTER COLUMN "version_open_status" SET DEFAULT 'open';
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
