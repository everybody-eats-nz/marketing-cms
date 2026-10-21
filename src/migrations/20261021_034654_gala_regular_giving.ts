import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

// The regular-giving-at-the-Gala page, created here (not by a seed script) so it
// appears on deploy: scripts/ is excluded from the production image, and the
// production database is only reachable from inside the container.
//
// The content is a frozen snapshot of GALA_NOIR_DEFAULTS (src/blocks/GalaNoir.ts)
// as of this migration, so a database migrated later gets exactly the page
// production got, whatever the defaults say by then.
const GALA_GIVING_SLUG = 'gala-giving'

const GALA_GIVING_BLOCKS = [
  {
    blockType: 'galaNoirGivingHero',
    eyebrow: 'The Everybody Eats Gala',
    title: 'Regular\ngiving',
    intro: 'Keep the magic of the Gala going all year. Become an Everybody Eats superstar with a monthly gift and help us plan and grow our impact across Aotearoa.',
    primaryCtaLabel: 'Choose a monthly gift',
    secondaryCtaLabel: 'Prefer to give once?',
    secondaryCtaUrl: '/get-involved/donate',
    showBadge: true,
  },
  {
    blockType: 'galaNoirMonthlyGifts',
    eyebrow: '',
    heading: 'Pick your monthly gift',
    body: 'Choose an amount that suits your budget. Every gift is a secure monthly payment through Stripe.',
    periodLabel: 'a month',
    ctaLabel: 'Give {amount}',
    gifts: [
      {
        amount: 10,
        blurb: 'Help build stronger communities.',
        url: 'https://buy.stripe.com/eVag0McpH070e2I3cd',
      },
      {
        amount: 20,
        blurb: 'Dignified dining for everyone.',
        url: 'https://buy.stripe.com/28odSEdtL070cYE4gi',
      },
      {
        amount: 50,
        blurb: 'Rescue quality food from going to waste.',
        url: 'https://buy.stripe.com/4gw4i4ahz8Dwf6MeUX',
      },
      {
        amount: 100,
        blurb: 'Keep the doors open for everybody.',
        url: 'https://buy.stripe.com/7sI6qcgFX9HA4s87sw',
      },
      {
        amount: 250,
        blurb: 'Bringing people together over food.',
        url: 'https://buy.stripe.com/14k6qc9dv0705wc28d',
      },
      {
        amount: 500,
        blurb: 'Be part of building a more sustainable food system.',
        url: 'https://buy.stripe.com/eVa01O4Xf1b4gaQcMS',
      },
    ],
  },
  {
    blockType: 'galaNoirGivingWays',
    eyebrow: '',
    heading: 'Other ways to give',
    ways: [
      {
        title: 'A personalised plan',
        body: 'Want to give a different amount, or talk it through? We will set up a plan that suits your budget.',
        email: 'amy@everybodyeats.nz',
        detail: '',
      },
      {
        title: 'Bank transfer',
        body: 'Kiwibank, Everybody Eats Charitable Trust. Use your name and organisation as the reference.',
        email: '',
        detail: '38-9020-0272020-00',
      },
      {
        title: 'Claim it back',
        body: 'Donations of $5 or more are eligible for a 33.33% tax credit through IRD. Get in touch for a donation receipt.',
        email: '',
        detail: '',
      },
    ],
  },
  {
    blockType: 'galaNoirGiveOnce',
    heading: 'Not ready for monthly?\nGive once.',
    body: 'Every one-off gift goes straight towards keeping our doors open and our communities fed.',
    ctaLabel: 'Make a one-off gift',
    ctaUrl: '/get-involved/donate',
    footerLeft: 'The Everybody Eats Gala · Friday 30 October 2026 · St Matthew-in-the-City, Auckland',
    footerRight: 'Photography from previous Everybody Eats Galas',
  },
]

/**
 * Whether the current config still has every giving block. Migrations replay
 * against the config of the day, so if these blocks are ever removed, a fresh
 * database skips the page instead of failing validation mid-chain.
 */
function hasGivingBlocks(payload: Payload) {
  const layout = payload.collections.pages.config.fields.find(
    (f) => 'name' in f && f.name === 'layout',
  )
  const slugs = new Set(
    layout && layout.type === 'blocks' ? layout.blocks.map((block) => block.slug) : [],
  )
  return GALA_GIVING_BLOCKS.every((block) => slugs.has(block.blockType))
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_gala_noir_giving_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'The Everybody Eats Gala',
  	"title" varchar DEFAULT 'Regular
  giving',
  	"intro" varchar DEFAULT 'Keep the magic of the Gala going all year. Become an Everybody Eats superstar with a monthly gift and help us plan and grow our impact across Aotearoa.',
  	"show_badge" boolean DEFAULT true,
  	"primary_cta_label" varchar DEFAULT 'Choose a monthly gift',
  	"secondary_cta_label" varchar DEFAULT 'Prefer to give once?',
  	"secondary_cta_url" varchar DEFAULT '/get-involved/donate',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_monthly_gifts_gifts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"blurb" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_monthly_gifts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'Pick your monthly gift',
  	"body" varchar DEFAULT 'Choose an amount that suits your budget. Every gift is a secure monthly payment through Stripe.',
  	"period_label" varchar DEFAULT 'a month',
  	"cta_label" varchar DEFAULT 'Give {amount}',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_giving_ways_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"email" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_giving_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'Other ways to give',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gala_noir_give_once" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"heading" varchar DEFAULT 'Not ready for monthly?
  Give once.',
  	"body" varchar DEFAULT 'Every one-off gift goes straight towards keeping our doors open and our communities fed.',
  	"cta_label" varchar DEFAULT 'Make a one-off gift',
  	"cta_url" varchar DEFAULT '/get-involved/donate',
  	"footer_left" varchar DEFAULT 'The Everybody Eats Gala · Friday 30 October 2026 · St Matthew-in-the-City, Auckland',
  	"footer_right" varchar DEFAULT 'Photography from previous Everybody Eats Galas',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_giving_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT 'The Everybody Eats Gala',
  	"title" varchar DEFAULT 'Regular
  giving',
  	"intro" varchar DEFAULT 'Keep the magic of the Gala going all year. Become an Everybody Eats superstar with a monthly gift and help us plan and grow our impact across Aotearoa.',
  	"show_badge" boolean DEFAULT true,
  	"primary_cta_label" varchar DEFAULT 'Choose a monthly gift',
  	"secondary_cta_label" varchar DEFAULT 'Prefer to give once?',
  	"secondary_cta_url" varchar DEFAULT '/get-involved/donate',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_monthly_gifts_gifts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"blurb" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_monthly_gifts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'Pick your monthly gift',
  	"body" varchar DEFAULT 'Choose an amount that suits your budget. Every gift is a secure monthly payment through Stripe.',
  	"period_label" varchar DEFAULT 'a month',
  	"cta_label" varchar DEFAULT 'Give {amount}',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_giving_ways_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"email" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_giving_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'Other ways to give',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gala_noir_give_once" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"heading" varchar DEFAULT 'Not ready for monthly?
  Give once.',
  	"body" varchar DEFAULT 'Every one-off gift goes straight towards keeping our doors open and our communities fed.',
  	"cta_label" varchar DEFAULT 'Make a one-off gift',
  	"cta_url" varchar DEFAULT '/get-involved/donate',
  	"footer_left" varchar DEFAULT 'The Everybody Eats Gala · Friday 30 October 2026 · St Matthew-in-the-City, Auckland',
  	"footer_right" varchar DEFAULT 'Photography from previous Everybody Eats Galas',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_gala_noir_giving_hero" ADD CONSTRAINT "pages_blocks_gala_noir_giving_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_giving_hero" ADD CONSTRAINT "pages_blocks_gala_noir_giving_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_monthly_gifts_gifts" ADD CONSTRAINT "pages_blocks_gala_noir_monthly_gifts_gifts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_monthly_gifts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_monthly_gifts" ADD CONSTRAINT "pages_blocks_gala_noir_monthly_gifts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_monthly_gifts" ADD CONSTRAINT "pages_blocks_gala_noir_monthly_gifts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_giving_ways_ways" ADD CONSTRAINT "pages_blocks_gala_noir_giving_ways_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gala_noir_giving_ways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_giving_ways" ADD CONSTRAINT "pages_blocks_gala_noir_giving_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_give_once" ADD CONSTRAINT "pages_blocks_gala_noir_give_once_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gala_noir_give_once" ADD CONSTRAINT "pages_blocks_gala_noir_give_once_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_giving_hero" ADD CONSTRAINT "_pages_v_blocks_gala_noir_giving_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_giving_hero" ADD CONSTRAINT "_pages_v_blocks_gala_noir_giving_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_monthly_gifts_gifts" ADD CONSTRAINT "_pages_v_blocks_gala_noir_monthly_gifts_gifts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_monthly_gifts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_monthly_gifts" ADD CONSTRAINT "_pages_v_blocks_gala_noir_monthly_gifts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_monthly_gifts" ADD CONSTRAINT "_pages_v_blocks_gala_noir_monthly_gifts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_giving_ways_ways" ADD CONSTRAINT "_pages_v_blocks_gala_noir_giving_ways_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gala_noir_giving_ways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_giving_ways" ADD CONSTRAINT "_pages_v_blocks_gala_noir_giving_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_give_once" ADD CONSTRAINT "_pages_v_blocks_gala_noir_give_once_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gala_noir_give_once" ADD CONSTRAINT "_pages_v_blocks_gala_noir_give_once_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_gala_noir_giving_hero_order_idx" ON "pages_blocks_gala_noir_giving_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_giving_hero_parent_id_idx" ON "pages_blocks_gala_noir_giving_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_giving_hero_path_idx" ON "pages_blocks_gala_noir_giving_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_giving_hero_image_idx" ON "pages_blocks_gala_noir_giving_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_monthly_gifts_gifts_order_idx" ON "pages_blocks_gala_noir_monthly_gifts_gifts" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_monthly_gifts_gifts_parent_id_idx" ON "pages_blocks_gala_noir_monthly_gifts_gifts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_monthly_gifts_order_idx" ON "pages_blocks_gala_noir_monthly_gifts" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_monthly_gifts_parent_id_idx" ON "pages_blocks_gala_noir_monthly_gifts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_monthly_gifts_path_idx" ON "pages_blocks_gala_noir_monthly_gifts" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_monthly_gifts_image_idx" ON "pages_blocks_gala_noir_monthly_gifts" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gala_noir_giving_ways_ways_order_idx" ON "pages_blocks_gala_noir_giving_ways_ways" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_giving_ways_ways_parent_id_idx" ON "pages_blocks_gala_noir_giving_ways_ways" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_giving_ways_order_idx" ON "pages_blocks_gala_noir_giving_ways" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_giving_ways_parent_id_idx" ON "pages_blocks_gala_noir_giving_ways" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_giving_ways_path_idx" ON "pages_blocks_gala_noir_giving_ways" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_give_once_order_idx" ON "pages_blocks_gala_noir_give_once" USING btree ("_order");
  CREATE INDEX "pages_blocks_gala_noir_give_once_parent_id_idx" ON "pages_blocks_gala_noir_give_once" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gala_noir_give_once_path_idx" ON "pages_blocks_gala_noir_give_once" USING btree ("_path");
  CREATE INDEX "pages_blocks_gala_noir_give_once_image_idx" ON "pages_blocks_gala_noir_give_once" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_hero_order_idx" ON "_pages_v_blocks_gala_noir_giving_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_hero_parent_id_idx" ON "_pages_v_blocks_gala_noir_giving_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_hero_path_idx" ON "_pages_v_blocks_gala_noir_giving_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_hero_image_idx" ON "_pages_v_blocks_gala_noir_giving_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_monthly_gifts_gifts_order_idx" ON "_pages_v_blocks_gala_noir_monthly_gifts_gifts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_monthly_gifts_gifts_parent_id_idx" ON "_pages_v_blocks_gala_noir_monthly_gifts_gifts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_monthly_gifts_order_idx" ON "_pages_v_blocks_gala_noir_monthly_gifts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_monthly_gifts_parent_id_idx" ON "_pages_v_blocks_gala_noir_monthly_gifts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_monthly_gifts_path_idx" ON "_pages_v_blocks_gala_noir_monthly_gifts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_monthly_gifts_image_idx" ON "_pages_v_blocks_gala_noir_monthly_gifts" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_ways_ways_order_idx" ON "_pages_v_blocks_gala_noir_giving_ways_ways" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_ways_ways_parent_id_idx" ON "_pages_v_blocks_gala_noir_giving_ways_ways" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_ways_order_idx" ON "_pages_v_blocks_gala_noir_giving_ways" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_ways_parent_id_idx" ON "_pages_v_blocks_gala_noir_giving_ways" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_giving_ways_path_idx" ON "_pages_v_blocks_gala_noir_giving_ways" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_give_once_order_idx" ON "_pages_v_blocks_gala_noir_give_once" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gala_noir_give_once_parent_id_idx" ON "_pages_v_blocks_gala_noir_give_once" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gala_noir_give_once_path_idx" ON "_pages_v_blocks_gala_noir_give_once" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gala_noir_give_once_image_idx" ON "_pages_v_blocks_gala_noir_give_once" USING btree ("image_id");`)

  // Never touch an existing page: an editor may have created or customised it.
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: GALA_GIVING_SLUG } },
    limit: 1,
    depth: 0,
    draft: true,
    req,
  })
  if (existing.docs.length === 0 && hasGivingBlocks(payload)) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Regular giving at the Gala',
        slug: GALA_GIVING_SLUG,
        layout: GALA_GIVING_BLOCKS,
        seo: {
          title: 'Regular giving — The Everybody Eats Gala',
          description:
            'Keep the magic of the Gala going all year. Become an Everybody Eats superstar with a monthly gift and help us plan and grow our impact across Aotearoa.',
        },
        _status: 'published',
      } as any,
      req,
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // The page's layout lives in the tables dropped below, so it can't outlive them.
  await payload.delete({
    collection: 'pages',
    where: { slug: { equals: GALA_GIVING_SLUG } },
    req,
  })

  await db.execute(sql`
   DROP TABLE "pages_blocks_gala_noir_giving_hero" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_monthly_gifts_gifts" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_monthly_gifts" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_giving_ways_ways" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_giving_ways" CASCADE;
  DROP TABLE "pages_blocks_gala_noir_give_once" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_giving_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_monthly_gifts_gifts" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_monthly_gifts" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_giving_ways_ways" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_giving_ways" CASCADE;
  DROP TABLE "_pages_v_blocks_gala_noir_give_once" CASCADE;`)
}
