/**
 * Adds entry points to the new `/impact` data-story page:
 *   1. a primary header-nav item       (Navigation global → primary)
 *   2. a footer link                    (Footer global → first column)
 *   3. a CTA strip on the home page      (Pages `home` → layout)
 *
 * Idempotent and additive — it never removes or reorders existing items, and
 * re-running it is a no-op once each entry exists (matched by the `/impact`
 * href). Run it ONLY after the `/impact` page is deployed, or the links will
 * point at a 404.
 *
 * Usage (defaults to whatever DATABASE_URI .env resolves to — for the local dev
 * DB, override inline and disable schema push):
 *
 *   NODE_ENV=production \
 *   DATABASE_URI=postgres://payload:payload@localhost:5433/everybodyeats \
 *   pnpm tsx scripts/seed-impact-link.ts
 *
 * Flags:
 *   --no-cta        skip the home-page CTA strip (nav + footer only)
 *   --page=<slug>   put the CTA on a different page (default: home)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const IMPACT_HREF = '/impact'
const NAV_LABEL = 'Our impact'
const FOOTER_LABEL = 'Our impact'

const args = process.argv.slice(2)
const withCta = !args.includes('--no-cta')
const ctaPageSlug = (args.find((a) => a.startsWith('--page='))?.split('=')[1] ?? 'home').trim()

const impactLink = {
  link: { label: NAV_LABEL, type: 'internal' as const, internalHref: IMPACT_HREF },
}

/** True if a linkGroup value already points at the impact page. */
const isImpactLink = (l: any) => l?.link?.type === 'internal' && l?.link?.internalHref === IMPACT_HREF

async function main() {
  const payload = await getPayload({ config })

  // 1 ─ Primary nav ----------------------------------------------------------
  const nav = (await payload.findGlobal({ slug: 'navigation' })) as any
  const primary: any[] = nav.primary || []
  if (primary.some(isImpactLink)) {
    console.log('• nav: "Our impact" already present — skipping')
  } else {
    await payload.updateGlobal({
      slug: 'navigation',
      data: { primary: [...primary, { ...impactLink, previewImage: null }] },
    })
    console.log(`✓ nav: added "${NAV_LABEL}" → ${IMPACT_HREF}`)
  }

  // 2 ─ Footer link ----------------------------------------------------------
  const footer = (await payload.findGlobal({ slug: 'footer' })) as any
  const columns: any[] = footer.columns || []
  const alreadyInFooter = columns.some((col) => (col?.links || []).some(isImpactLink))
  if (alreadyInFooter) {
    console.log('• footer: "Our impact" already present — skipping')
  } else if (columns.length === 0) {
    await payload.updateGlobal({
      slug: 'footer',
      data: { columns: [{ heading: 'Explore', links: [{ link: { ...impactLink.link, label: FOOTER_LABEL } }] }] },
    })
    console.log(`✓ footer: created "Explore" column with "${FOOTER_LABEL}"`)
  } else {
    // Append to the first column, preserving everything else.
    const next = columns.map((col, i) =>
      i === 0
        ? { ...col, links: [...(col.links || []), { link: { ...impactLink.link, label: FOOTER_LABEL } }] }
        : col,
    )
    await payload.updateGlobal({ slug: 'footer', data: { columns: next } })
    console.log(`✓ footer: added "${FOOTER_LABEL}" to column "${columns[0]?.heading ?? '(first)'}"`)
  }

  // 3 ─ Home-page CTA strip --------------------------------------------------
  if (!withCta) {
    console.log('• cta: skipped (--no-cta)')
  } else {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: ctaPageSlug } },
      limit: 1,
      depth: 0,
    })
    const page = found.docs[0] as any
    if (!page) {
      console.log(`• cta: no "${ctaPageSlug}" page found — skipping CTA`)
    } else {
      const layout: any[] = page.layout || []
      const hasImpactCta = layout.some(
        (b) => b?.blockType === 'ctaStrip' && b?.primaryCta?.href === IMPACT_HREF,
      )
      if (hasImpactCta) {
        console.log(`• cta: "${ctaPageSlug}" already has an impact CTA — skipping`)
      } else {
        const ctaBlock = {
          blockType: 'ctaStrip',
          heading: 'See the *difference* a seat makes.',
          body: 'Six years of pay-as-you-feel dinners, in numbers — meals served, food rescued, and the volunteers behind every night.',
          variant: 'forest',
          align: 'center',
          primaryCta: { label: 'Explore our impact', href: IMPACT_HREF },
        }
        await payload.update({
          collection: 'pages',
          id: page.id,
          data: { _status: 'published', layout: [...layout, ctaBlock] },
        })
        console.log(`✓ cta: appended impact CTA strip to "${ctaPageSlug}" (published)`)
      }
    }
  }

  console.log('\nDone. Remember: this only helps once /impact is live.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
