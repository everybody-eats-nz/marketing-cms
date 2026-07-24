# 🍽️ Everybody Eats — Marketing CMS

The marketing site and CMS for [Everybody Eats](https://www.everybodyeats.nz), a New Zealand pay-as-you-feel restaurant charity. Migrated off Webflow onto a self-hosted **Next.js + Payload** stack.

> 🧱 Pages are composed from reusable content blocks edited in the Payload admin and rendered by matching React Server Components on the frontend.

## 🛠️ Stack

- ⚡ **Next.js 15** (App Router, React 19) — both the public site and the CMS admin live in one app
- 📦 **Payload 3** — headless CMS mounted at `/admin`, served by the same Next.js process
- 🐘 **Postgres 16** (via Docker) — content store, port `5433`
- 🎨 **Tailwind 3** with a custom editorial palette (`cream` / `forest` / `sun` / `clay`)
- ✒️ **Fraunces** (display, soft-wonk italics) + **Plus Jakarta Sans** (body)
- 🔠 **TypeScript** end-to-end
- 📦 **pnpm** (required — see `engines` in [package.json](package.json))

## 🚀 Getting started

### Prerequisites

- 📌 Node.js `^18.20.2` or `>=20.9.0`
- 📌 pnpm `^9 || ^10 || ^11`
- 📌 Docker (for Postgres)

### Setup

```bash
# 1. install deps
pnpm install

# 2. configure env
cp .env.example .env
#    then edit .env — at minimum set PAYLOAD_SECRET to a long random string

# 3. start the database
pnpm db:up

# 4. run the app
pnpm dev
```

Then visit:

- 🌐 **Site** → http://localhost:3000
- 🔐 **Admin** → http://localhost:3000/admin (create the first user on boot)

> 💡 First boot may take a moment as Payload generates the admin importMap and runs initial schema sync.

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | 🏃 Next.js + Payload admin in dev mode |
| `pnpm devsafe` | 🧹 Same as `dev` but wipes `.next/` first |
| `pnpm build` | 🏗️ Production build |
| `pnpm start` | 🎯 Run the production build |
| `pnpm lint` | ✅ ESLint via `next lint` |
| `pnpm db:up` / `pnpm db:down` | 🐘 Start / stop the Postgres container |
| `pnpm payload` | 🛠️ Raw Payload CLI |
| `pnpm generate:types` | 🧬 Regenerate `src/payload-types.ts` after editing collections / globals / blocks |
| `pnpm migrate` | ⬆️ Apply pending DB migrations |
| `pnpm migrate:create` | ➕ Create a new migration |
| `pnpm extract:webflow` | 📥 One-off: pull content from Webflow into `data/webflow/` |
| `pnpm seed` | 🌱 Upsert `data/webflow/` content into Payload (idempotent, by slug) |

## 🗂️ Project layout

```
src/
├── app/
│   ├── (frontend)/         🌐 Public marketing site routes
│   │   ├── page.tsx        → renders the page with slug "home"
│   │   ├── [...slug]/      → renders any other CMS page by slug path
│   │   ├── dine-with-us/   → bespoke location detail pages
│   │   ├── events/         → bespoke event detail pages
│   │   └── journal/        → bespoke journal post pages
│   └── (payload)/          🔐 Auto-generated admin + REST/GraphQL routes
├── blocks/                 🧱 Payload Block configs (Hero, Stats, CtaStrip, …)
├── collections/            🗃️ Payload Collections (Pages, Locations, Events, …)
├── globals/                🌍 Singletons (SiteSettings, Navigation, Footer)
├── components/blocks/      🎨 React Server Components that render each block
├── fields/                 🧩 Shared field helpers (link, seo)
├── lib/                    🔧 Payload client + small type/url helpers
└── payload.config.ts       ⚙️ Payload entry point
```

## 🧱 The blocks pattern (most important thing)

Pages have a `layout` field that is an **array of blocks**. To add a new section type you touch three places:

1. **Block config** in [`src/blocks/`](src/blocks/) — defines the admin fields and a unique `slug`.
2. **Block renderer** in [`src/components/blocks/`](src/components/blocks/) — the React component that renders it.
3. **Register on both sides** — add the block to the `blocks: [...]` array in [Pages.ts](src/collections/Pages.ts) *and* add a `case` in [render-blocks.tsx](src/components/blocks/render-blocks.tsx).

> ⚠️ Forget either side and the block silently disappears. Keep them in sync.

For the full architecture overview (page fetch pipeline, draft mode, live preview, bespoke pages), see [CLAUDE.md](CLAUDE.md).

## 👀 Draft mode & live preview

- 📝 Pages have versioning + drafts enabled.
- 🔁 The Payload admin's Live Preview pane points at `/api/preview?path=…`, which enables Next.js `draftMode()` and redirects to the page — edits stream in via `@payloadcms/live-preview-react`.
- 📱 Configured breakpoints: mobile (375×667), tablet (768×1024), desktop (1440×900).

## 🖼️ Images

All media goes through Payload's upload pipeline with Sharp generating four sizes:

| Size | Width | Use case |
| --- | --- | --- |
| `thumbnail` | 400px | admin thumbnails, list cards |
| `card` | 800px | grid cards |
| `feature` | 1400px | most editorial use |
| `hero` | 2000px | full-bleed heroes |

Always render Payload media via [`<PayloadImage>`](src/components/payload-image.tsx) — it picks the right size and falls back gracefully.

## 🔐 Environment variables

See [.env.example](.env.example). The required ones:

- `DATABASE_URI` — Postgres connection string (the Docker default is preconfigured)
- `PAYLOAD_SECRET` — long random string used to sign Payload JWTs
- `NEXT_PUBLIC_SITE_URL` — used for SEO metadata, OG image base, and live preview origin

Optional, only for the Webflow extraction script:

- `WEBFLOW_API_TOKEN`, `WEBFLOW_SITE_ID`

## 🌱 Seeding from Webflow

There's a one-time content migration pipeline in [scripts/](scripts/):

```bash
pnpm extract:webflow   # → writes data/webflow/ (gitignored)
pnpm seed              # → upserts into Payload by slug
```

The `seed-*.ts` scripts then build the blocks-based `layout` arrays from the extracted Webflow HTML. These are bootstrap-only, not part of the runtime path.

## 🚢 Deploying to Coolify

The app ships with a [`Dockerfile`](Dockerfile) and [`docker-entrypoint.sh`](docker-entrypoint.sh) that work as-is on Coolify (or any container host).

### 1. Provision Postgres

In Coolify → **Resources → New → Database → PostgreSQL** (16+). Copy the internal connection string — it looks like `postgres://USER:PASS@<service-name>:5432/<db>`.

### 2. Create the application

**Resources → New → Application → Public/Private Repository**, pick this repo, then:

- **Build Pack**: `Dockerfile`
- **Port (exposed)**: `3000`
- **Health-check path**: `/admin/login` (returns 200 once the server is up)

### 3. Environment variables

| Key | Value |
| --- | --- |
| `DATABASE_URI` | the Postgres connection string from step 1 |
| `PAYLOAD_SECRET` | a long random string (e.g. `openssl rand -base64 48`) |
| `NEXT_PUBLIC_SITE_URL` | the public URL Coolify gives the app (e.g. `https://cms.example.org`) |

#### PostHog Error Tracking source maps (build-time)

To symbolicate production JavaScript stack traces in [PostHog Error Tracking](https://us.posthog.com/project/200228/error_tracking), the build must upload source maps. These variables are read during `next build`, so in Coolify they **must be marked "Available at build time"** (the build-arg toggle) — a plain runtime variable is not passed to `docker build`, and the upload is silently skipped, leaving stack traces unsymbolicated.

| Key | Value |
| --- | --- |
| `POSTHOG_API_KEY` | a [personal API key](https://us.posthog.com/settings/user-api-keys) with **error tracking write** + **organization read** scopes (not the `phc_…` project key) |
| `POSTHOG_PROJECT_ID` | the numeric project ID from [project settings](https://us.posthog.com/settings/project#variables) |
| `POSTHOG_HOST` | *(optional)* PostHog app host for upload; defaults to `https://us.posthog.com` |

After a deploy, confirm a new entry appears under [Error Tracking → Symbol sets](https://us.posthog.com/project/200228/error_tracking/configuration#selectedSetting=error-tracking-symbol-sets).

### 4. Persistent storage

Add a **Storage** mount so uploaded media survives redeploys:

- **Source**: `<auto>` (Coolify-managed volume)
- **Destination**: `/app/media`

### 5. Deploy

Hit **Deploy**. The [`docker-entrypoint.sh`](docker-entrypoint.sh) will:

1. Run [`src/baseline-migrations.ts`](src/baseline-migrations.ts) — a one-time-per-database guard that converts a database originally created by schema push to migration tracking (no-op on fresh databases and on every boot after the first).
2. Run `payload migrate` to apply any pending migrations from `src/migrations/`.
3. Start Next.js on port 3000.

Visit `/admin` to create the first admin user.

### Schema changes are migration-based

Drizzle schema push only runs in local dev (`NODE_ENV === 'development'` — see the `push` option in [`src/payload.config.ts`](src/payload.config.ts)). Push prompts interactively on destructive changes, which hangs non-TTY deploys, so production only ever applies checked-in migrations:

1. After changing collections/globals/blocks, run `pnpm migrate:create <name>` against a **clean** database (the long-lived dev DB accumulates orphaned tables that pollute the diff).
2. Commit the generated `src/migrations/*` files with the schema change.
3. Deploy — the entrypoint runs `payload migrate` before the server starts.

## 📚 Further reading

- 🧠 [CLAUDE.md](CLAUDE.md) — architectural notes for working in this codebase
- 📖 [Payload docs](https://payloadcms.com/docs)
- 📖 [Next.js App Router docs](https://nextjs.org/docs/app)
- 📖 [Coolify docs](https://coolify.io/docs)
