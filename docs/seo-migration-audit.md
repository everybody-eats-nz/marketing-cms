# SEO Migration Audit — Squarespace → Payload/Next

Source: Google Search Console export `everybodyeats.nz`, *Performance on Search*, last 12 months (pulled 2026-06-21). Web search type only.

## TL;DR

- **38,681 clicks / ~250k impressions / yr.** Traffic is **99% New Zealand** and **70% mobile** — optimise for NZ mobile, ignore international.
- Search is overwhelmingly **branded** ("everybody eats", "everybody eats wellington", "...onehunga"). People look you up by name and land on the **homepage and the three location pages** — those four URLs earn **~83% of all clicks**. Protecting them is the whole game.
- The new IA **preserves most paths** (`/get-involved/*`, `/our-story`, `/dine-with-us/<city>` all carry over unchanged), so the redirect surface is small.
- **Two things will break SEO if shipped as-is:** the `/journal-posts/` → `/journal/` rename, and the high-traffic Squarespace duplicate `/dine-with-us/onehunga-auck` (1,468 clicks/yr) which has no home in the new site.
- **Host canonicalisation** (www→apex, http→https) must be handled at the proxy/DNS layer — clicks are currently split across all three variants.

---

## 1. Top traffic (deduped by path; host variants summed)

| Old path | Clicks/yr | Impr/yr | New destination | Action |
|---|--:|--:|---|---|
| `/` | 18,002 | 217,580 | `/` | ✅ no change |
| `/dine-with-us/wellington` | 5,293 | 82,156 | `/dine-with-us/wellington` | ✅ no change |
| `/dine-with-us/onehunga` | 4,517 | 54,858 | `/dine-with-us/onehunga` | ✅ no change |
| `/dine-with-us/glen-innes` | 3,495 | 37,870 | `/dine-with-us/glen-innes` | ✅ no change |
| `/get-involved/volunteer` | 1,674 | 29,194 | `/get-involved/volunteer` | ✅ no change |
| `/dine-with-us/onehunga-auck` | **1,468** | 16,260 | `/dine-with-us/onehunga` | 🔴 **301 redirect** |
| `/dine-with-us` | 648 | 48,866 | `/dine-with-us` | ✅ no change |
| `/about-us/our-team` | 390 | 12,463 | `/about/team` | 🟠 **301 redirect** |
| `/our-story` | 172 | 22,850 | `/our-story` | ✅ no change |
| `/about-us/contact-us` | 131 | 16,137 | `/contact` | 🟠 **301 redirect** |
| `/events` | 129 | 3,061 | `/events` | ✅ no change |
| `/about-us/faqs` | 75 | 5,796 | `/about/faqs` | 🟠 **301 redirect** |
| `/get-involved/cooking-sessions/meals-that-matter` | 25 | 5,737 | same | ✅ no change |
| `/get-involved/donate` | 23 | 1,278 | `/get-involved/donate` | ✅ no change |
| `/get-involved-2` | 20 | 3,302 | `/get-involved` | 🟠 **301 redirect** |
| `/get-involved/donate/fundraise-for-everybody-eats` | 17 | 1,275 | `/get-involved/fundraise` | 🟠 **301 redirect** |
| `/get-involved/dining-voucher-page` | 10 | 763 | _decision needed_ | ⚠️ see §4 |

**Portal pages — out of scope for this repo:** `/login` (1,710), `/shifts` (171), `/register` (56), `/password` live on the volunteer portal (`app.everybodyeats.nz` / `volunteers.everybodyeats.nz`), not the marketing site. No action here.

---

## 2. Redirect map (path-level — for `next.config.mjs` `redirects()`)

All `permanent: true` (301). The two existing legal redirects in [next.config.mjs](../next.config.mjs) stay.

| Source | Destination | Why |
|---|---|---|
| `/journal-posts/:slug*` | `/journal/:slug*` | Collection renamed `journal-posts` → `journal`. Wildcard covers all posts. **Verify slug parity — see §3.** |
| `/dine-with-us/onehunga-auck` | `/dine-with-us/onehunga` | Squarespace duplicate of the Onehunga page; 1,468 clicks/yr. |
| `/about-us/our-team` | `/about/team` | Section moved. |
| `/about-us/contact-us` | `/contact` | Contact promoted to top level. |
| `/about-us/faqs` | `/about/faqs` | Section moved. |
| `/about-us` | `/about` | Parent path. |
| `/get-involved-2` | `/get-involved` | Squarespace `-2` artifact. |
| `/get-involved/donate/fundraise-for-everybody-eats` | `/get-involved/fundraise` | Page renamed + flattened. |

**Paths that DON'T need redirects** (new IA kept them identical): `/`, `/our-story`, `/dine-with-us`, `/dine-with-us/{wellington,onehunga,glen-innes}`, `/get-involved/volunteer`, `/get-involved/donate`, `/get-involved/cooking-sessions/meals-that-matter`, `/events`. Just confirm the pages are published.

---

## 3. Slug-parity risks to verify before launch

The path *pattern* matches but individual slugs came from a different CMS export (Webflow), so the leaf slugs may differ from Squarespace's:

- **Journal posts** (`/journal-posts/<slug>` → `/journal/<slug>`): old slugs seen in GSC — `meet-aneri-nathu`, `pride-dinners-2025`, `dine-for-good-comes-to-poneke`, `living-on-a-budget`, `nicole-gaston-nice-assets`. Confirm each resolves on the new `/journal/<slug>`. Low traffic (~150 clicks/yr total) but cheap to get right. Where a slug differs, add an explicit `/journal-posts/<old> → /journal/<new>` redirect *above* the wildcard.
- **Events** (`/events/<slug>`): old slugs carry Squarespace artifacts like `...-copy` (e.g. `everybody-eats-in-te-komititanga-climate-friendly-community-meal-copy`). Most GSC entries are **past one-off events** (Cuba Dupa, Clay It Forward, autumn social table) — low long-term SEO value. Recommend: don't hand-map these; let them 404 or add a single catch-all `/events/:slug* → /events` only if you want to avoid 404s. Decide per §4.

> No DB query was run for this audit — slug parity should be confirmed against the live/seeded CMS (or a post-launch crawl), not assumed.

---

## 4. Open decisions

1. **`/get-involved/dining-voucher-page`** (10 clicks/yr) — no obvious equivalent in the new IA. Redirect to `/get-involved/donate`, to a dedicated voucher page, or drop it?
2. **Dead/stale events** — 301 each past event to `/events`, or let them 404? (404 is legitimate for genuinely-gone content; Google drops them. A blanket redirect to `/events` can look like a soft-404.)
3. **Long tail** — ~39 paths under 10 clicks/yr (incl. `/work-in-progress`, `/resources`, `/archive`, `/hygiene`, `/get-involved-2` children). Most are negligible; cull list available on request.

---

## 5. Host & infra checklist (NOT Next `redirects()` — handle at Coolify/Cloudflare)

GSC shows clicks split across all of these — they must collapse to one canonical origin with 301s:

- [ ] `http://` → `https://`
- [ ] `www.everybodyeats.nz` → `everybodyeats.nz` (or the reverse — pick one canonical and keep it consistent with `<link rel=canonical>` and the sitemap).
- [ ] Confirm `everybodyeats.nz` apex is the canonical host the new deploy serves on.
- [ ] Submit a fresh `sitemap.xml` in Search Console after launch.
- [ ] Keep the GSC property verified through the cutover; watch Coverage/Pages for a 404 spike in week 1.
- [ ] Per-page `<title>`/meta + canonical tags on the homepage and 3 location pages — these carry the branded rankings; don't regress them.

---

## 6. Priority order for launch

1. 🔴 **Must-fix (or lose ranked traffic):** `onehunga-auck` redirect, `/journal-posts/*` wildcard, host canonicalisation (§5).
2. 🟠 **Should-fix:** `about-us/*`, `get-involved-2`, `fundraise` redirects (~600 clicks/yr combined).
3. ⚪ **Nice-to-have:** journal/event slug parity verification, long-tail cleanup, voucher-page decision.
