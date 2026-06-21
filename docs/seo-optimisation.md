# SEO Optimisation — turning Search Console demand into clicks

Companion to `seo-migration-audit.md`. That doc protects existing rankings through the cutover; **this one is about growing traffic** by aligning the *content we already have* with what people actually search for.

Source: same GSC export (`everybodyeats.nz`, last 12 months, pulled 2026-06-21).

## The core insight

| | Branded ("everybody eats…") | Non-branded |
|---|--:|--:|
| Share of **impressions** | 32% | **68%** |
| Share of **clicks** | 89% | **11%** |
| Typical position | 1–2 | 8–13 |

We win every search for our own name, but **two-thirds of the demand Google already shows us for is non-branded** — "onehunga restaurants", "cheap eats wellington", "free food auckland", "soup kitchen volunteer auckland" — and we convert almost none of it because we sit at the bottom of page 1 / top of page 2 with weak snippets.

The technical foundation is already strong: `pageMetadata` (canonical + OG/Twitter), `sitemap.ts`, `robots.ts`, and structured-data builders for Organization/Restaurant/FAQ/Event/BlogPosting/Breadcrumbs all exist. **This is a keyword-targeting + CTR problem, not a plumbing problem.** Most fixes below are CMS edits (SEO title/description, taglines, intros), not deploys.

---

## Priority 1 — Volunteer page: ranked, but the snippet is failing (highest ROI)

We already rank **near the top** for high-intent volunteer queries and barely get clicked — a textbook "the title/description doesn't match the search" problem. Fixing the snippet is a pure CTR win with no ranking work needed.

| Query | Impr/yr | Position | CTR |
|---|--:|--:|--:|
| `food bank volunteer auckland` | 418 | **2.5** | 0.7% |
| `soup kitchen volunteer auckland` | 864 | **4.7** | 0.9% |
| `food charity volunteer` | 138 | **4.8** | 0.0% |
| `everybody eats volunteer` | 663 | 2.4 | 80.5% |

The branded one converts at 80%; the generic-intent ones at ~1%. People searching "soup kitchen volunteer auckland" don't recognise our title as the answer.

**Action** (CMS — page `get-involved/volunteer`, SEO fields):
- **Title:** `Volunteer in Auckland & Wellington — Food Rescue & Community Meals | Everybody Eats`
- **Description:** `Volunteer with Everybody Eats — help cook and serve restaurant-quality community meals from rescued food in Auckland and Wellington. No experience needed; pick a shift online.`
- Work the phrases **"soup kitchen / food bank / food charity / community meals / Auckland / Wellington"** into the page H1 and intro copy.

---

## Priority 2 — Location pages own the biggest non-branded cluster (local "restaurant/eats/food + suburb")

This is where the volume is. The location pages already rank pos 6–11 for local-intent searches; tightening titles, descriptions and intro copy can push them onto page 1 and lift CTR. All editable per-location via the `seo` + `tagline`/`intro` fields (or change the default in [dine-with-us/[slug]/page.tsx:100](../src/app/(frontend)/dine-with-us/[slug]/page.tsx#L100), currently just `` `${loc.name} restaurant` ``).

**Onehunga** — our strongest local cluster (`/dine-with-us/onehunga`, pos 6):

| Query | Impr/yr | Pos |
|---|--:|--:|
| `onehunga restaurants` | 2,283 | 8.3 |
| `restaurants onehunga` / `restaurant onehunga` / `restaurants in onehunga` | ~1,400 | 5.8–9.8 |
| `cafe onehunga` / `onehunga cafe` / `onehunga cafes` | ~1,700 | 10–11 |
| `onehunga food` / `food onehunga` | ~1,200 | 10–11 |
| `onehunga neighbourhood eatery` | 457 | 6.7 |

→ **Title:** `Onehunga Restaurant — Pay What You Can | Everybody Eats` · **Desc:** weave "neighbourhood eatery in Onehunga", "restaurant-quality meals", "pay what you can". Add a line of body copy describing it as an Onehunga restaurant/eatery (the page is menu-led; it lacks the plain-language "restaurant in Onehunga" terms it's ranking for).

**Wellington** (`/dine-with-us/wellington`, pos 9.3 — most headroom):

| Query | Impr/yr | Pos | CTR |
|---|--:|--:|--:|
| `wellington eats` | 1,398 | 4.8 | 12.4% |
| `cheap eats wellington` | 944 | 7.3 | 2.5% |
| `all you can eat wellington` | 637 | 10.8 | 1.7% |
| `free food wellington` | 425 | 6.5 | 8.7% |
| `new restaurants wellington` / `where to eat wellington` / `best cheap eats wellington` / `cheap restaurants wellington` | ~1,300 | 8–13 | low |

→ **Title:** `Cheap Eats in Wellington — Pay What You Can | Everybody Eats` · **Desc:** "Wellington's pay-as-you-feel restaurant… restaurant-quality meals from rescued food, pay what you can." Use "cheap eats / where to eat / pay what you can" in the intro.

**Glen Innes** — thinner demand (`glen innes` 611 impr, pos 12.2) but same treatment: ensure "Glen Innes restaurant/eatery" appears in title + intro.

> Note: position numbers for very broad heads ("food", "eat", "restaurants near me") look like opportunities but are unwinnable national/generic terms — **ignore them** and focus on suburb-qualified and "cheap/free eats + city" queries, where our model genuinely matches intent.

---

## Priority 3 — The "free / pay-what-you-can food" mission cluster

A real, on-mission demand pool we're only half-capturing:

| Query | Impr/yr | Pos |
|---|--:|--:|
| `free food wellington` | 425 | 6.5 |
| `free food` | 400 | 10.5 |
| `free food auckland` / `free food nz` / `free food near me … auckland` | ~750 | 8–13 |

People search "free food [city]"; our pay-as-you-feel / "no one turned away for lack of funds" model is exactly the answer, but our copy leads with "pay-as-you-feel" (insider phrasing) rather than the words people type.

**Action:** ensure the homepage and location pages explicitly include **"pay what you can"** and **"free if you can't pay"** alongside "pay-as-you-feel". Consider a short "How it works / Pay what you can" explainer section (CMS block) targeting these terms — it's our single biggest differentiator and currently underexpressed for search.

---

## Priority 4 — CTR rewrites on high-impression, low-CTR pages

Pages getting shown a lot but rarely clicked = weak title/description. Pure snippet work.

| Page | Impr/yr | Pos | CTR | Fix |
|---|--:|--:|--:|---|
| `/dine-with-us` (index) | **48,866** | 7.4 | **1.3%** | Biggest single CTR opportunity. Title: `Find an Everybody Eats Restaurant — Auckland & Wellington` · desc: "Pay-what-you-can restaurants… find your nearest in Onehunga, Glen Innes or Wellington." |
| `/our-story` | 22,850 | 4.6 | 0.8% | Ranks well for something generic; sharpen desc to a one-line mission hook. Lower priority. |
| `/about/faqs` | 5,796 | — | 1.3% | See Priority 5 (FAQ schema). |

---

## Priority 5 — Structured-data quick wins (rich results → CTR)

1. **FAQ schema is already wired ✅** — `buildFaqPage()` renders inside the FAQs accordion block ([faqs-accordion-block.tsx:44](../src/components/blocks/faqs-accordion-block.tsx#L44)), so any page using that block (e.g. `/about/faqs`, 5,796 impr/yr) is already eligible for FAQ rich snippets. No action — just confirm the FAQ page actually uses the block. *(An earlier draft of this doc flagged it as missing; that was a grep that only scanned `src/app/`.)*
2. **Restaurant schema** ([structured-data.tsx:61](../src/components/structured-data.tsx#L61)) — `servesCuisine` was `'Pay-as-you-feel'`, which isn't a cuisine; **changed to `'New Zealand'`** (the pay-what-you-can signal already lives in `priceRange`). Still worth adding `openingHoursSpecification` if/when opening hours land in the CMS — hours show directly in local results.
3. **Event schema** is wired ✓. Keep it; it's why one-off events (Cuba Dupa, etc.) pick up impressions.

---

## What to ignore

- Broad national heads: `food`, `eat`, `restaurants near me`, `eating out` — huge impressions, unwinnable, irrelevant traffic. Don't optimise for them.
- International traffic — 99% of clicks are NZ. No hreflang / international work needed.
- Portal queries (`everybody eats login`, `volunteer login`, `shifts`) — these belong to the volunteer portal subdomains, out of scope for this site.

---

## Suggested order of work

**Shipped in this PR (code):** location pages now honour `loc.seo.title` (it was being ignored) and fall back to a keyword-led `"<Name> Restaurant — Pay What You Can"`; `servesCuisine` corrected. The CMS copy below is applied by `scripts/seed-seo-metadata.ts` (run against the CMS — see its header).

1. **Volunteer page** title/description rewrite — ranked #2–5 already, instant CTR. *(in seed script)*
2. **Onehunga + Wellington** location title/description — biggest non-branded volume. *(in seed script)*
3. **`/dine-with-us` index** title/description — 49k impressions at 1.3% CTR. *(in seed script)*
4. **Location intro copy** + a **"Pay what you can / free food" pass** on the homepage and location pages — still a manual CMS edit (body copy, not just `seo` fields). Weave in "cheap eats / where to eat / free food / pay what you can / <suburb> restaurant".
5. Run `pnpm tsx scripts/seed-seo-metadata.ts` against the CMS, publish, then re-pull GSC 4–6 weeks later and compare position/CTR on the queries above.

> The seed script only fills empty `seo` fields by default (won't clobber editor copy); pass `--force` to overwrite. Body-copy changes (item 4) remain hands-on in the Payload admin.
