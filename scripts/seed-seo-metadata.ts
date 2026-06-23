/**
 * Applies the Search-Console-driven SEO copy from `docs/seo-optimisation.md` to
 * the CMS: per-location and per-page `seo.title` / `seo.description`.
 *
 * Why a script: these pages are CMS documents (locations + Pages rendered via
 * [...slug]), so their titles/descriptions live in the database, not code. This
 * is the repo's established pattern for targeted content updates (see
 * seed-impact-link.ts).
 *
 * Safety: by default it only fills EMPTY seo fields and never clobbers copy an
 * editor has already written — re-running is a no-op. Pass `--force` to
 * overwrite with the canonical values below. Page/location updates are
 * published (these collections have drafts enabled), so a pending unrelated
 * draft on the same doc would also go live — run it on a clean doc state.
 *
 * Usage (defaults to whatever DATABASE_URI .env resolves to — for the local dev
 * DB, override inline and disable schema push):
 *
 *   NODE_ENV=production \
 *   DATABASE_URI=postgres://payload:payload@localhost:5433/everybodyeats \
 *   pnpm tsx scripts/seed-seo-metadata.ts [--force]
 *
 * The layout's title template appends " — Everybody Eats", so titles below omit
 * the brand suffix (and avoid repeating it mid-title to prevent a doubled brand).
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const force = process.argv.slice(2).includes('--force')

type Seo = { title?: string; description?: string }

// Per-location targets — keyed by slug. Onehunga/Glen Innes match the new code
// default ("<Name> Restaurant — Pay What You Can"); Wellington leads with the
// "cheap eats" intent it ranks for. Descriptions are the real CTR lever.
const LOCATION_SEO: Record<string, Seo> = {
  onehunga: {
    title: 'Onehunga Restaurant — Pay What You Can',
    description:
      "A neighbourhood eatery in Onehunga serving restaurant-quality three-course meals made from rescued food. Pay what you can — everyone's welcome. Book a table.",
  },
  wellington: {
    title: 'Cheap Eats in Wellington — Pay What You Can',
    description:
      "Wellington's pay-as-you-feel restaurant: three restaurant-quality courses from rescued ingredients, and you pay what you can. Everyone's welcome — book a table.",
  },
  'glen-innes': {
    title: 'Glen Innes Restaurant — Pay What You Can',
    description:
      "A pay-as-you-feel restaurant in Glen Innes serving three-course meals made from rescued food. Pay what you can — everyone's welcome. Book a table.",
  },
}

// Per-page targets — keyed by Pages slug.
const PAGE_SEO: Record<string, Seo> = {
  'get-involved/volunteer': {
    title: 'Volunteer in Auckland & Wellington — Food Rescue & Community Meals',
    description:
      'Volunteer with Everybody Eats — help cook and serve community meals made from rescued food in Auckland and Wellington. No experience needed; pick a shift online.',
  },
  'dine-with-us': {
    title: 'Find a Pay-What-You-Can Restaurant — Auckland & Wellington',
    description:
      "Find your nearest Everybody Eats restaurant — Onehunga, Glen Innes and Wellington. Restaurant-quality meals from rescued food, pay what you can. Everyone's welcome.",
  },
  'our-story': {
    description:
      "How Everybody Eats grew from one pop-up dinner into Aotearoa's pay-as-you-feel restaurants — rescuing good food and serving restaurant-quality meals to everyone.",
  },
}

/** Merge target seo onto existing, respecting --force and never blanking. */
function nextSeo(existing: any, target: Seo): { seo: any; changed: string[] } {
  const seo = { ...(existing || {}) }
  const changed: string[] = []
  for (const key of ['title', 'description'] as const) {
    const want = target[key]
    if (!want) continue
    const have = (seo[key] ?? '').toString().trim()
    if (have && !force) continue // keep editor copy unless --force
    if (have === want) continue // already correct
    seo[key] = want
    changed.push(key)
  }
  return { seo, changed }
}

async function main() {
  const payload = await getPayload({ config })

  // 1 ─ Locations ------------------------------------------------------------
  for (const [slug, target] of Object.entries(LOCATION_SEO)) {
    const { docs } = await payload.find({
      collection: 'locations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const loc = docs[0] as any
    if (!loc) {
      console.log(`• location "${slug}": not found — skipping`)
      continue
    }
    const { seo, changed } = nextSeo(loc.seo, target)
    if (!changed.length) {
      console.log(`• location "${slug}": seo already set — skipping (use --force to overwrite)`)
      continue
    }
    await payload.update({
      collection: 'locations',
      id: loc.id,
      data: { _status: 'published', seo },
    })
    console.log(`✓ location "${slug}": set seo ${changed.join(' + ')}`)
  }

  // 2 ─ Pages ----------------------------------------------------------------
  for (const [slug, target] of Object.entries(PAGE_SEO)) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const page = docs[0] as any
    if (!page) {
      console.log(`• page "${slug}": not found — skipping`)
      continue
    }
    const { seo, changed } = nextSeo(page.seo, target)
    if (!changed.length) {
      console.log(`• page "${slug}": seo already set — skipping (use --force to overwrite)`)
      continue
    }
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { _status: 'published', seo },
    })
    console.log(`✓ page "${slug}": set seo ${changed.join(' + ')}`)
  }

  console.log('\nDone. Re-pull Search Console in 4–6 weeks to compare CTR/position.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
