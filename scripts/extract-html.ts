/**
 * Fetch public HTML for every non-template Webflow page so we can reference
 * the layout, copy, and imagery while building the new frontend.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.cwd(), 'data/webflow/html')
const PUBLIC = 'https://www.everybodyeats.nz'

const SKIP = new Set([
  'detail_team',
  'detail_journal-posts',
  'detail_events',
  'detail_quotes',
  'detail_faqs',
  'detail_gift-cards',
  'detail_major-business-partners',
  'detail_minor-business-partners',
  'detail_funding-partners',
  'detail_supporting-partners',
  'detail_sku',
  'detail_product',
  'detail_category',
  'component-sheet',
  'style-sheet',
  'components',
  '401',
  '404',
  'order-confirmation',
  'paypal-checkout',
  'checkout',
  'home---backup',
  'our-story-copy',
  'our-story---archive',
  'donate-old',
  'home',
  '',
])

// Known Webflow path prefixes for grouped pages — empirically Webflow groups
// many pages under section folders. We'll try the slug, the slug nested under
// the most likely parent, and fall back to a redirect-follow.
const PARENTS: Record<string, string[]> = {
  'wellington': ['locations', 'dine-with-us'],
  'onehunga': ['locations', 'dine-with-us'],
  'onehunga-auck': ['locations', 'dine-with-us'],
  'glen-innes': ['locations', 'dine-with-us'],
  'guest-chefs': ['get-involved'],
  'volunteer': ['get-involved'],
  'corporate-groups': ['get-involved'],
  'cooking-sessions': ['get-involved'],
  'school-sessions': ['get-involved'],
  'cooking-for-a-cause': ['get-involved'],
  'meals-that-matter': ['get-involved'],
  'restaraunt-takeovers': ['get-involved'],
  'special-events-2': ['get-involved'],
  'hospitality-partners': ['partners'],
  'food-partners': ['partners'],
  'funding-partners': ['partners'],
  'supporting-partners': ['partners'],
  'grants-trusts-and-foundations': ['partners'],
  'fundraise-for-everybody-eats': ['donate'],
  'corporate-giving': ['donate'],
  'regular-giving': ['donate'],
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function tryFetch(url: string): Promise<{ ok: boolean; html: string; status: number }> {
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) return { ok: false, html: '', status: res.status }
    const html = await res.text()
    return { ok: true, html, status: res.status }
  } catch {
    return { ok: false, html: '', status: 0 }
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const pagesRaw = JSON.parse(await readFile(path.resolve(process.cwd(), 'data/webflow/pages.json'), 'utf8'))
  const pages: Array<{ slug: string; title: string }> = pagesRaw.pages

  let saved = 0
  const failed: string[] = []

  for (const page of pages) {
    const slug = page.slug
    if (!slug || SKIP.has(slug)) continue

    const candidates = [
      `/${slug}`,
      ...(PARENTS[slug] || []).map((p) => `/${p}/${slug}`),
    ]
    let hit: string | null = null
    let html = ''
    for (const c of candidates) {
      const res = await tryFetch(`${PUBLIC}${c}`)
      if (res.ok && res.html.length > 1000) {
        hit = c
        html = res.html
        break
      }
      await sleep(120)
    }

    if (!hit) {
      failed.push(slug)
      console.log(`  ✗ ${slug}`)
      continue
    }
    const safeFile = slug.replace(/[^a-z0-9-]+/gi, '_')
    await writeFile(path.join(OUT, `${safeFile}.html`), html, 'utf8')
    saved++
    console.log(`  ✓ ${slug.padEnd(40)} → ${hit}  (${(html.length / 1024).toFixed(0)} kB)`)
    await sleep(150)
  }

  console.log(`\nSaved ${saved} pages. ${failed.length} not found.`)
  if (failed.length) console.log('Missing slugs:', failed.join(', '))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
