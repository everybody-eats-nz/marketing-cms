/**
 * Create/refresh the Toast one-pager (Pages doc, slug `toast`).
 * Idempotent: re-running overwrites the layout of the existing doc (and creates
 * it if missing), so it also replaces the earlier copy that was duplicated off
 * the Hopper page.
 *
 * Usage:
 *   pnpm tsx scripts/seed-toast.ts
 *
 * Requires .env (DATABASE_URI, PAYLOAD_SECRET).
 */

import 'dotenv/config'
import path from 'path'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { VOLUNTEER_LINKS } from '../src/lib/volunteer-links'

// Run from the repo root, same as the other seed scripts.
const ROOT = process.cwd()

/**
 * Coffee Supreme's logotype, as supplied by them — placed in their own red,
 * not recoloured. Lives in public/ so the asset is versioned with the repo and
 * this script has something to upload from on a fresh database.
 */
const SUPREME_LOGO = 'public/images/coffee-supreme.png'

/** Upload a local file into `media` once. Payload converts uploads to WebP, so
 *  the stored filename loses the original extension — match on the stem. */
async function uploadOrFind(payload: any, localFile: string, alt: string): Promise<string | null> {
  const filePath = path.join(ROOT, localFile)
  if (!existsSync(filePath)) {
    console.warn(`  ✗ missing asset: ${localFile}`)
    return null
  }
  const name = path.basename(localFile)
  const stem = name.replace(/\.[^.]+$/, '')
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { like: stem } },
    limit: 1,
  })
  if (existing.totalDocs > 0) return existing.docs[0].id

  const buffer = await readFile(filePath)
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: 'image/png', name, size: buffer.length },
  })
  return created.id
}

async function main() {
  const payload = await getPayload({ config })

  const supremeId = await uploadOrFind(payload, SUPREME_LOGO, 'Coffee Supreme')

  const layout = [
    {
      blockType: 'toastHero',
      kicker: 'an everybody eats cafe',
      kickerHref: '/',
      label: 'pop-up community cafe',
      addressLine: '306 Onehunga Mall, Onehunga',
      hoursLine: 'Fri 7.30–2.30 · Sat + Sun 8.30–2.30',
    },
    {
      blockType: 'toastStatement',
      eyebrow: 'The idea',
      heading: 'A local, neighbourhood café with a bigger purpose.',
      body: "Toast is Everybody Eats newest pop-up café, serving great food & coffee at accessible prices. Our menu is focussed around inventive toppings on fresh sourdough and oats served alongside Supreme Coffee & our own shrubs & cordials. By choosing Toast, you're helping to fund our pay-what-you-can restaurants and the communities they serve every night.",
      ...(supremeId
        ? {
            aside: {
              image: supremeId,
              label: 'Coffee by',
              href: 'https://www.coffeesupreme.com',
            },
          }
        : {}),
    },
    {
      // Seeded empty on purpose: the block is here so the menu artwork can be
      // dropped straight into the admin. It renders nothing until a sheet or a
      // PDF is uploaded.
      blockType: 'toastMenu',
      eyebrow: 'The menu',
      sheets: [],
      downloadLabel: 'Download the menu (PDF)',
    },
    {
      blockType: 'toastVisit',
      eyebrow: 'Find us',
      // Same premises as the Everybody Eats Onehunga restaurant — keep this
      // matching the structured data in src/app/(toast)/toast/page.tsx.
      address: '306 Onehunga Mall\nOnehunga, Auckland',
      hours: [
        { days: 'Friday', times: '7.30am – 2.30pm' },
        { days: 'Saturday', times: '8.30am – 2.30pm' },
        { days: 'Sunday', times: '8.30am – 2.30pm' },
      ],
      mapLabel: 'Open in maps ↗',
      mapHref: 'https://maps.google.com/?q=306+Onehunga+Mall,+Onehunga,+Auckland',
    },
    {
      blockType: 'toastStatement',
      eyebrow: 'Lend a hand',
      heading: 'Toast is being built by its community — and there’s a spot here for you.',
      body: 'If you’d like to volunteer, we’d love to have you. Front of house, kitchen, dishes — no experience needed.',
      // Toast runs out of the Onehunga premises, so the Auckland landing page
      // is the right destination. Swap for a portal deep link (the pattern
      // scripts/seed-hopper.ts uses) once Toast has its own portal location.
      cta: { label: 'Volunteer with us', href: VOLUNTEER_LINKS.auckland },
    },
  ]

  const data = {
    title: 'Toast',
    slug: 'toast',
    layout,
    seo: {
      title: 'Toast Community Cafe — 306 Onehunga Mall, Onehunga, Auckland',
      description:
        'Toast is Everybody Eats’ pop-up community cafe at 306 Onehunga Mall — inventive toppings on fresh sourdough, oats, Supreme coffee and housemade shrubs and cordials. Open Friday to Sunday.',
    },
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'toast' } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`Updated toast page (id ${existing.docs[0].id})`)
  } else {
    const created = await payload.create({ collection: 'pages', data })
    console.log(`Created toast page (id ${created.id})`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
