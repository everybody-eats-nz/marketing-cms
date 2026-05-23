# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site + CMS for **Everybody Eats** (NZ pay-as-you-feel restaurant charity), migrated off Webflow. It's a single Next.js 15 (App Router) app that hosts both:

- The public-facing marketing site at `/` (under `src/app/(frontend)/`)
- The Payload CMS admin at `/admin` (under `src/app/(payload)/`)

Both run from the same Next.js process. Payload is mounted via `withPayload()` in [next.config.mjs](next.config.mjs).

## Common commands

```bash
pnpm db:up              # start Postgres in Docker (port 5433)
pnpm dev                # Next.js + Payload admin at localhost:3000
pnpm devsafe            # same, but wipes .next first

pnpm payload            # raw Payload CLI
pnpm generate:types     # regenerate src/payload-types.ts after editing collections/globals/blocks
pnpm migrate:create     # create a new DB migration
pnpm migrate            # run pending migrations

pnpm extract:webflow    # one-off: pull content from Webflow into data/webflow/ (needs WEBFLOW_API_TOKEN)
pnpm seed               # seed Payload from data/webflow/ (idempotent, upserts by slug)

pnpm lint               # next lint
pnpm build              # next build
```

Package manager is **pnpm** (see `engines` in package.json). Postgres runs in Docker on port **5433** (not 5432) — see [docker-compose.yml](docker-compose.yml).

## Architecture: blocks-based page rendering

The whole frontend hinges on one pattern: **Pages are documents with a `layout` field that is an array of Blocks**, and the renderer walks that array. To add a new section type you touch three places — config, renderer, registration.

### 1. Block config (`src/blocks/*.ts`)
Each block is a Payload `Block` object defining its fields. Examples: `Hero.ts`, `Stats.ts`, `LocationsGrid.ts`. The block's `slug` (e.g. `'hero'`, `'donateHero'`) is the discriminator used downstream.

### 2. Block renderer (`src/components/blocks/*.tsx`)
Each block has a matching React component (e.g. `hero-block.tsx` renders the `Hero` block). These are Server Components by default. Add client interactivity via separate `'use client'` components.

### 3. Registration (two spots)
- [src/collections/Pages.ts](src/collections/Pages.ts) — import the block and add it to the `blocks: [...]` array on the `layout` field. This is what makes it appear in the admin.
- [src/components/blocks/render-blocks.tsx](src/components/blocks/render-blocks.tsx) — add a `case 'blockSlug':` to the switch. This is what makes it render on the frontend.

If you forget either side, the block silently disappears (config only → admin can add it but nothing renders; renderer only → never reachable). Keep the two in sync.

### Page fetch + render pipeline
- [src/app/(frontend)/page.tsx](src/app/(frontend)/page.tsx) → the `/` route, hard-coded to the page with `slug: 'home'`.
- [src/app/(frontend)/[...slug]/page.tsx](src/app/(frontend)/[...slug]/page.tsx) → every other CMS page, slug joined with `/` (so a page with slug `our-story/values` lives at `/our-story/values`).
- Both call [fetchPageDoc + PageBody from page-body.tsx](src/components/blocks/page-body.tsx), which:
  1. Looks up the page by slug, honouring `draftMode()` for preview.
  2. Inspects which block types are in `layout` and conditionally fetches only the **extras** those blocks need (locations, events, journal, team, faqs, partners, site-settings). In draft mode it fetches everything so newly-added blocks render immediately.
  3. In draft mode, hands off to `<PageLivePreview>` (a client component using `@payloadcms/live-preview-react`); otherwise renders `<RenderBlocks>` directly.

Live preview is wired through Payload's admin: [src/app/(frontend)/api/preview/route.ts](src/app/(frontend)/api/preview/route.ts) enables `draftMode()` then redirects. The preview URL is built in [Pages.ts livePreview.url](src/collections/Pages.ts) — slug `home` → `/`, anything else → `/{slug}`.

### Bespoke (non-blocks) pages
Some pages are *not* CMS-driven and fetch their own collection data directly:
- `/dine-with-us/[slug]` → renders a Locations collection doc directly (not via blocks).
- `/events/[slug]`, `/journal/[slug]` → similar pattern for their respective collections.

When adding a new collection-backed detail page, follow this pattern (don't try to force it through the blocks pipeline).

## Data model

**Collections** (in [src/payload.config.ts](src/payload.config.ts)): `users`, `media`, `pages`, `locations`, `team-members`, `events`, `journal-posts`, `quotes`, `faqs`, `partners`, `daily-menus`. **Globals**: `site-settings`, `navigation`, `footer`.

- Pages have `versions.drafts: true` — content edits go through draft → publish.
- `media` uses Sharp with four named image sizes: `thumbnail` (400w), `card` (800w), `feature` (1400w), `hero` (2000w). Always go through [`<PayloadImage>`](src/components/payload-image.tsx) which picks the right size and falls back gracefully — don't reach for `next/image` directly with raw Payload media objects.
- The shared `linkGroup` field ([src/fields/link.ts](src/fields/link.ts)) is the canonical pattern for CMS links (internal vs. external with conditional UI). Resolve it via `resolveHref()` in [src/lib/types.ts](src/lib/types.ts).
- `seoField` ([src/fields/seo.ts](src/fields/seo.ts)) is reused across collections that need per-doc SEO override.

## Payload client access

Server-side fetches go through [`getPayloadClient()` in src/lib/payload.ts](src/lib/payload.ts), which memoises the Payload instance for the process. Use this instead of calling `getPayload({ config })` inline so warm imports stay cheap.

The `@payload-config` alias resolves to `src/payload.config.ts` (see tsconfig paths). The `@/*` alias points to `src/*`.

## After editing collections / globals / blocks

Run `pnpm generate:types` to refresh [src/payload-types.ts](src/payload-types.ts). Most of the rendering code uses `any` casts anyway (see comments in [src/lib/types.ts](src/lib/types.ts)), but the generated types are the source of truth for typed admin work.

If the schema change is structural, also create a migration: `pnpm migrate:create`.

## Styling

Tailwind 3 with a custom brand palette ([tailwind.config.ts](tailwind.config.ts)): `cream`, `forest`, `sun`, `clay`, `ink`. Display font is Fraunces — self-hosted via `next/font/local` from the same variable TTFs the original Webflow site uses (in `public/fonts/`, all four axes `SOFT`/`WONK`/`opsz`/`wght`). Body is Plus Jakarta Sans.

Brand convention: wrap a word in `<em>` (or `*asterisks*` in CMS textareas that the renderer converts) to render the light editorial italic — see the `.display em` rule in [globals.css](src/app/(frontend)/globals.css), which matches the live Webflow site (`font-weight: 230`, defaults on every variation axis).

## Webflow extraction & seeding

There's a one-time content migration pipeline in `scripts/`:

- `extract-webflow.ts` → pulls Webflow Data API content + HTML into `data/webflow/` (gitignored).
- `seed.ts` → upserts that data into Payload by slug. Safe to re-run.
- `seed-pages-layouts.ts`, `seed-home-layout.ts`, `seed-nav-images.ts` → build out the blocks-based `layout` arrays from the extracted Webflow page HTML.

These exist to bootstrap the CMS; they're not part of the runtime path.

## Working inside `.claude/worktrees/*`

Git worktrees don't copy untracked files, so a fresh worktree has **no `.env`** — Payload then fails to boot with `Error: missing secret key. A secret key is needed to secure Payload.` Before starting the dev server in a worktree, symlink the main repo's `.env`:

```bash
ln -s ../../../.env .env
```

(From a worktree at `.claude/worktrees/<name>/`, `../../../.env` resolves to the main repo root.) Prefer a symlink over copying so the worktree stays in sync if secrets change.

The Postgres container from `pnpm db:up` is shared across worktrees on port 5433 — don't start a second one.

## Always-load skills

For any UI/frontend work in this repo (component edits, page layouts, styling, design review), load these two skills via the Skill tool before doing the work — do not wait to be asked:

- `frontend-design:frontend-design` — production-grade frontend interface generation, avoids generic AI aesthetics.
- `ui-ux-pro-max:ui-ux-pro-max` — UI/UX design intelligence (50+ styles, 161 palettes, 57 font pairings, component patterns).

