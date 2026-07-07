/**
 * Seed the Partners directory that powers the public "Partners" page
 * (Pages doc slug `get-involved/partner`). Three tiers:
 *   major       — large logo + hover blurb, links through to the partner site
 *   supporting  — medium logo, links through
 *   friend      — name-only link, grouped by friendCategory
 *
 * Logos and richer copy (Major hover blurbs) are filled in through the CMS;
 * this seed lays down the names, tiers and grouping so the page has real
 * structure to build on. Logos already attached to existing records are
 * preserved across re-runs (matched by name).
 *
 * Idempotent: upserts by slug and removes partner records that are no longer
 * part of the directory (e.g. the old Webflow platinum/gold/funding tiers).
 *
 * Usage:
 *   pnpm tsx scripts/seed-partners.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET). Also called from seed.ts.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type PartnerSpec = { name: string; url?: string; description?: string; friendCategory?: string }

const MAJOR_PARTNERS: PartnerSpec[] = [
  { name: 'Stoddart' },
  { name: 'Foodstuffs' },
]

const SUPPORTING_PARTNERS: PartnerSpec[] = [
  { name: 'Daily Bread' },
  { name: 'Kaibosh' },
  { name: 'FairFoods' },
  { name: 'Kai Ika' },
  { name: 'Pak’nSave Clendon' },
  { name: 'Pak’nSave Māngere' },
  { name: 'Auckland Council' },
  { name: 'NowBookIt' },
  { name: 'Howick Local Board' },
  { name: 'The Produce Company' },
  { name: 'National Mini Storage' },
  { name: 'Nikau Foundation' },
  { name: 'Wellington City Council' },
  { name: 'Perpetual Guardian' },
  { name: 'QBE Foundation' },
  { name: 'McCarthy Trust' },
  { name: 'Anthony Harper' },
  { name: 'Vavasour Trust' },
  { name: 'Meridian' },
  { name: 'Kiwi Community Assistance (KCA)' },
  { name: 'New World Willis Street Metro' },
  { name: 'Salvation Army' },
  { name: 'Raglan Food Company' },
  { name: 'Flower Power Canola Oil' },
  { name: 'Fujifilm' },
  { name: 'Apparel Master' },
  { name: 'Naturally Organic' },
]

const FRIEND_PARTNERS: PartnerSpec[] = [
  // Food & Hospitality
  { name: 'Commonsense Organics', friendCategory: 'food-hospitality' },
  { name: 'Daily Bread', friendCategory: 'food-hospitality' },
  { name: 'Fair Food', friendCategory: 'food-hospitality' },
  { name: 'KiwiHarvest', friendCategory: 'food-hospitality' },
  { name: 'New World Metro', friendCategory: 'food-hospitality' },
  { name: 'Salvation Army Food Bank', friendCategory: 'food-hospitality' },
  { name: 'The FoodBowl', friendCategory: 'food-hospitality' },
  { name: 'Hands Down', friendCategory: 'food-hospitality' },
  { name: 'Lord Kitchener', friendCategory: 'food-hospitality' },
  { name: 'WOOP', friendCategory: 'food-hospitality' },
  { name: 'Kai Ika Project (Legasea)', friendCategory: 'food-hospitality' },
  { name: 'Ceres Organics', friendCategory: 'food-hospitality' },
  { name: 'Moana NZ', friendCategory: 'food-hospitality' },
  { name: 'Wonky Box', friendCategory: 'food-hospitality' },
  { name: 'Perfectly Imperfect', friendCategory: 'food-hospitality' },
  { name: 'Green Grower', friendCategory: 'food-hospitality' },
  { name: 'Bluebird Bakery', friendCategory: 'food-hospitality' },
  { name: 'Four Square Onehunga', friendCategory: 'food-hospitality' },
  { name: 'Raglan Food Co', friendCategory: 'food-hospitality' },
  { name: 'Flower Power Canola Oil', friendCategory: 'food-hospitality' },
  { name: 'Apparel Master', friendCategory: 'food-hospitality' },
  { name: 'The Fresh Growers', friendCategory: 'food-hospitality' },
  { name: 'The Goodfood Group', friendCategory: 'food-hospitality' },
  { name: 'Sabato', friendCategory: 'food-hospitality' },
  { name: 'Naturally Organic', friendCategory: 'food-hospitality' },
  { name: 'Tāmaki Budgeting Services', friendCategory: 'food-hospitality' },
  { name: 'VDB Poultry', friendCategory: 'food-hospitality' },
  // Community
  { name: 'Kaibosh Hopper St', friendCategory: 'community' },
  { name: 'Kaibosh Petone', friendCategory: 'community' },
  { name: 'KCA (Kiwi Community Assistance)', friendCategory: 'community' },
  { name: 'New World Willis St Metro', friendCategory: 'community' },
  { name: 'Good For Store', friendCategory: 'community' },
  { name: 'New World Newlands', friendCategory: 'community' },
  { name: 'Flowers Manuela', friendCategory: 'community' },
  { name: 'Havana Coffee Works', friendCategory: 'community' },
  { name: 'Sisters of Compassion Soup Kitchen', friendCategory: 'community' },
  { name: 'Volco Bakery', friendCategory: 'community' },
  { name: 'MG Marketing', friendCategory: 'community' },
  // Business — no names yet; add them in the CMS and they appear automatically.
]

const partnerSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const normaliseName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '')

async function upsertBySlug(payload: any, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection: 'partners',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    return payload.update({ collection: 'partners', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'partners', data: { ...data, slug } })
}

export async function seedPartners(payload: any) {
  console.log('\n→ Partners')

  // Capture logos already attached to existing partner records so a re-seed
  // doesn't drop artwork we've uploaded through the CMS. Keyed by normalised name.
  const existing = await payload.find({ collection: 'partners', limit: 500, depth: 0 })
  const logoByName = new Map<string, any>()
  for (const doc of existing.docs as any[]) {
    if (doc.logo) logoByName.set(normaliseName(doc.name), doc.logo)
  }

  const tiers: Array<{ tier: string; items: PartnerSpec[] }> = [
    { tier: 'major', items: MAJOR_PARTNERS },
    { tier: 'supporting', items: SUPPORTING_PARTNERS },
    { tier: 'friend', items: FRIEND_PARTNERS },
  ]

  const keptSlugs = new Set<string>()
  for (const { tier, items } of tiers) {
    let i = 0
    for (const item of items) {
      const slug = `${tier}-${partnerSlug(item.name)}`
      keptSlugs.add(slug)
      await upsertBySlug(payload, slug, {
        name: item.name,
        tier,
        friendCategory: tier === 'friend' ? item.friendCategory : undefined,
        logo: tier === 'friend' ? undefined : logoByName.get(normaliseName(item.name)) ?? undefined,
        url: item.url || undefined,
        description: tier === 'major' ? item.description || '' : undefined,
        displayOrder: i++,
      })
    }
    console.log(`  ✓ ${items.length} ${tier}`)
  }

  // Remove partner records that are no longer part of the directory (e.g. the
  // old platinum/gold/funding tiers from the Webflow import).
  let removed = 0
  for (const doc of existing.docs as any[]) {
    if (!keptSlugs.has(doc.slug)) {
      await payload.delete({ collection: 'partners', id: doc.id })
      removed++
    }
  }
  if (removed) console.log(`  ✓ removed ${removed} stale partner(s)`)
}

async function main() {
  const payload = await getPayload({ config })
  await seedPartners(payload)
  console.log('\n✓ Partners seed complete.')
  process.exit(0)
}

// Run only when executed directly (not when imported by seed.ts).
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
