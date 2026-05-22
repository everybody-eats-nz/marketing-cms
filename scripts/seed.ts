/**
 * Seed the Payload database from the extracted Webflow dump.
 *
 * Idempotent: every record is upserted by slug. Re-running is safe.
 *
 * Usage:
 *   pnpm tsx scripts/seed.ts
 *
 * Requires:
 *   - .env loaded (DATABASE_URI, PAYLOAD_SECRET)
 *   - data/webflow/ populated (run `pnpm extract:webflow` first)
 */

import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ROOT = path.resolve(process.cwd(), 'data/webflow')

type AnyRec = Record<string, any>

function richTextFromHtml(html: string | null | undefined) {
  if (!html) return undefined
  // Lexical's default state accepts a stringified Lexical JSON, but Payload's
  // richText also accepts a simple plain-text fallback. The richtext-lexical
  // package exports `convertHTMLToLexical` from `@payloadcms/richtext-lexical/html`
  // but that's heavyweight; for seed purposes, we wrap the HTML into a simple
  // paragraph-only Lexical doc that preserves the source markup as plain text.
  const stripped = html
    .replace(/<\/?(p|div|br|span)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .trim()
  const paras = stripped.split(/\n+/).filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paras.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      })),
    },
  }
}

async function loadCollection(slug: string): Promise<{ schema: AnyRec; items: AnyRec[] }> {
  const file = path.join(ROOT, 'collections', `${slug}.json`)
  if (!existsSync(file)) return { schema: {}, items: [] }
  return JSON.parse(await readFile(file, 'utf8'))
}

async function ensureFirstUser(payload: any) {
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs > 0) {
    console.log(`  ↳ skipped — ${users.totalDocs} user(s) already exist`)
    return users.docs[0]
  }
  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@everybodyeats.nz',
      password: 'change-me-on-first-login',
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log(`  ✓ created admin user (admin@everybodyeats.nz / change-me-on-first-login)`)
  return user
}

async function upsertBySlug(payload: any, collection: string, slug: string, data: AnyRec) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    return payload.update({ collection, id: existing.docs[0].id, data })
  }
  return payload.create({ collection, data: { ...data, slug } })
}

// Media cache so we only upload each asset once
const mediaCache = new Map<string, string>()

async function uploadMedia(payload: any, localFile: string | undefined | null, alt?: string): Promise<string | null> {
  if (!localFile) return null
  if (mediaCache.has(localFile)) return mediaCache.get(localFile)!
  const filePath = path.join(ROOT, 'assets', localFile)
  if (!existsSync(filePath)) return null

  // Try to find by filename first (idempotent)
  const filename = path.basename(localFile)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    mediaCache.set(localFile, existing.docs[0].id)
    return existing.docs[0].id
  }

  const buffer = await readFile(filePath)
  const created = await payload.create({
    collection: 'media',
    data: { alt: alt || '' },
    file: {
      data: buffer,
      mimetype: guessMime(filename),
      name: filename,
      size: buffer.length,
    },
  })
  mediaCache.set(localFile, created.id)
  return created.id
}

function guessMime(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  return {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
  }[ext] || 'application/octet-stream'
}

async function seedLocations(payload: any) {
  console.log('\n→ Locations')
  // Hero images sourced from the live Webflow CDN — we picked one per restaurant
  const locations = [
    {
      name: 'Onehunga',
      slug: 'onehunga',
      city: 'Auckland',
      tagline: 'A pay-as-you-feel restaurant in the heart of Onehunga.',
      address: '292 Onehunga Mall, Onehunga, Auckland 1061',
      bookingUrl: 'https://www.everybodyeats.nz/dine-with-us/onehunga-auck',
      payAtTableUrl: 'https://www.everybodyeats.nz/dine-with-us/pay/all',
      openStatus: 'open',
      hours: [{ label: 'Wed – Sat', times: '5pm – 9pm', note: 'Last seating 8:30pm' }],
      heroImageFile: '6722e909b25b8836ac4fb3e8_IMG20240911130916.jpg',
    },
    {
      name: 'Glen Innes',
      slug: 'glen-innes',
      city: 'Auckland',
      tagline: 'Bringing pay-as-you-feel dining to East Auckland.',
      address: 'Glen Innes Town Centre, Auckland',
      bookingUrl: 'https://www.everybodyeats.nz/dine-with-us/glen-innes',
      payAtTableUrl: 'https://www.everybodyeats.nz/dine-with-us/pay/all',
      openStatus: 'open',
      hours: [{ label: 'Wed – Sat', times: '5pm – 9pm', note: 'Last seating 8:30pm' }],
      heroImageFile: '6891934bf5573fe950e1b327_RESIZED%20of%20A.%20McVinnie%20-%20EEGI%20Aug_K9A7404.jpg',
    },
    {
      name: 'Wellington',
      slug: 'wellington',
      city: 'Wellington',
      tagline: 'Pay-as-you-feel dining in central Wellington.',
      address: 'Wellington Central',
      bookingUrl: 'https://www.everybodyeats.nz/dine-with-us/wellington',
      payAtTableUrl: 'https://www.everybodyeats.nz/dine-with-us/pay/all',
      openStatus: 'open',
      hours: [{ label: 'Wed – Sat', times: '5pm – 9pm', note: 'Last seating 8:30pm' }],
      heroImageFile: '67e2378394cdd938f52d6b15_WLGPP25-Parade-154.jpg',
    },
  ]

  for (const loc of locations) {
    const heroId = await uploadMedia(payload, loc.heroImageFile, loc.name)
    const { heroImageFile, ...rest } = loc
    await upsertBySlug(payload, 'locations', loc.slug, { ...rest, heroImage: heroId })
    console.log(`  ✓ ${loc.name}`)
  }
}

async function seedTeamMembers(payload: any) {
  console.log('\n→ Team members')
  const { items } = await loadCollection('team')
  const STAFF_TYPE_MAP: Record<string, string> = {
    'board': 'board',
    'staff': 'leadership',
    'leadership': 'leadership',
  }
  let i = 0
  for (const item of items) {
    const f = item.fieldData || {}
    if (!f.slug || !f.name) continue
    const picId = await uploadMedia(payload, f['profile-picture']?._localFile, f.name)
    await upsertBySlug(payload, 'team-members', f.slug, {
      name: f.name,
      jobTitle: f['job-title'] || '',
      staffType: STAFF_TYPE_MAP[f['staff-type']?.toLowerCase()] || 'leadership',
      bioSummary: f['bio-summary'] || '',
      bio: richTextFromHtml(f.bio),
      profilePicture: picId,
      contact: {
        email: f.email || undefined,
        phone: f['phone-number'] || undefined,
        twitter: f['twitter-link'] || undefined,
        facebook: f['facebook-link'] || undefined,
      },
      displayOrder: i++,
    })
    console.log(`  ✓ ${f.name}`)
  }
}

async function seedQuotes(payload: any) {
  console.log('\n→ Quotes')
  const { items } = await loadCollection('quotes')
  for (const item of items) {
    const f = item.fieldData || {}
    if (!f.slug) continue
    await upsertBySlug(payload, 'quotes', f.slug, {
      quote: f['quote-text'] || f.name || '',
      attribution: f.name || 'Diner',
    })
    console.log(`  ✓ ${f.name?.slice(0, 60) || f.slug}`)
  }
}

async function seedFaqs(payload: any) {
  console.log('\n→ FAQs')
  const { items } = await loadCollection('faqs')
  let i = 0
  for (const item of items) {
    const f = item.fieldData || {}
    if (!f.slug) continue
    // FAQs collection requires unique slug — synthesize from question
    const slug = f.slug
    const existing = await payload.find({ collection: 'faqs', where: { question: { equals: f.name } }, limit: 1 })
    const data = {
      question: f.name,
      answer: richTextFromHtml(f.answer),
      category: 'about-us',
      displayOrder: i++,
    }
    if (existing.totalDocs > 0) {
      await payload.update({ collection: 'faqs', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'faqs', data })
    }
    console.log(`  ✓ ${f.name?.slice(0, 60)}`)
  }
}

async function seedPartners(payload: any) {
  console.log('\n→ Partners')
  const groups: Array<[string, string]> = [
    ['major-business-partners', 'platinum'],
    ['minor-business-partners', 'gold'],
    ['funding-partners', 'funding'],
    ['supporting-partners', 'supporting'],
  ]
  for (const [collection, tier] of groups) {
    const { items } = await loadCollection(collection)
    let i = 0
    for (const item of items) {
      const f = item.fieldData || {}
      if (!f.slug) continue
      const logoId = await uploadMedia(payload, f['partner-logo']?._localFile, f.name)
      await upsertBySlug(payload, 'partners', `${tier}-${f.slug}`, {
        name: f.name,
        tier,
        logo: logoId,
        url: f.link || undefined,
        description: f.description || '',
        displayOrder: i++,
      })
    }
    console.log(`  ✓ ${items.length} ${tier}`)
  }
}

async function seedEvents(payload: any) {
  console.log('\n→ Events')
  const { items } = await loadCollection('events')

  // Resolve location relationships by name
  const locations = await payload.find({ collection: 'locations', limit: 100 })
  const locByName = new Map<string, string>()
  for (const l of locations.docs) {
    locByName.set(l.name.toLowerCase(), l.id)
  }

  for (const item of items) {
    const f = item.fieldData || {}
    if (!f.slug || !f.name) continue
    const imageId = await uploadMedia(payload, f.image?._localFile, f.name)
    const date = f.date ? new Date(f.date).toISOString() : new Date().toISOString()
    const restaurant = f.restaurant?.toLowerCase()
    const locId = restaurant ? (locByName.get(restaurant) || locByName.get(restaurant.split(/[\s-]/)[0])) : undefined
    await upsertBySlug(payload, 'events', f.slug, {
      name: f.name,
      date,
      displayTime: f.time || '',
      location: locId,
      image: imageId,
      shortDescription: f['short-description'] || '',
      description: richTextFromHtml(f.description),
      tickets: {
        priceLabel: f.tickets || '',
        ticketUrl: f['ticket-link-2'] || undefined,
        caption: f.caption || '',
      },
    })
    console.log(`  ✓ ${f.name?.slice(0, 60)}`)
  }
}

async function seedJournalPosts(payload: any) {
  console.log('\n→ Journal posts')
  const { items } = await loadCollection('journal-posts')
  for (const item of items) {
    const f = item.fieldData || {}
    if (!f.slug || !f.name) continue
    const imageId = await uploadMedia(payload, f['main-image']?._localFile, f.name)
    await upsertBySlug(payload, 'journal-posts', f.slug, {
      title: f.name,
      summary: (f['post-summary'] || '').slice(0, 280),
      mainImage: imageId,
      author: f.author || '',
      category: 'story',
      publishedAt: item.lastPublished || item.createdOn || undefined,
      body: richTextFromHtml(f['post-content']),
    })
    console.log(`  ✓ ${f.name?.slice(0, 60)}`)
  }
}

async function seedDailyMenus(payload: any) {
  console.log('\n→ Daily menus')
  const { items } = await loadCollection('daily-menus')
  for (const item of items) {
    const f = item.fieldData || {}
    if (!f.slug) continue
    await upsertBySlug(payload, 'daily-menus', f.slug, {
      name: f.name || f.slug,
      menuDate: f['menu-date'],
      chefName: f.chefname || '',
      courses: {
        starter: f.starter || '',
        mainMeat: f.mainmeat || '',
        mainVeg: f.mainveg || '',
        vegOnly: f.vegonly || false,
        dessert: f.dessert || '',
        drink: f.drink || '',
      },
      announcement: richTextFromHtml(f.annoucement),
    })
    console.log(`  ✓ ${f.name || f.slug}`)
  }
}

async function seedGlobals(payload: any) {
  console.log('\n→ Globals')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Everybody Eats',
      tagline: 'Making a difference one plate at a time',
      description:
        'Restaurant-quality meals from rescued ingredients, served on a pay-as-you-feel basis. A New Zealand registered charity.',
      charityNumber: 'CC56055',
      contactEmail: 'hello@everybodyeats.nz',
      bookingUrl: '#bookingModal',
      donateUrl: '/get-involved/donate',
      volunteerUrl: 'https://volunteers.everybodyeats.nz',
      shopUrl: 'https://everybodyeatsnz.shop/',
      social: [
        { platform: 'instagram', url: 'https://www.instagram.com/everybodyeatsnz/' },
        { platform: 'facebook', url: 'https://www.facebook.com/everybodyeatsnz' },
      ],
      stats: [
        { value: '350,000', label: 'meals served' },
        { value: '8', label: 'years cooking with rescued food' },
        { value: '3', label: 'restaurants across Aotearoa' },
      ],
    },
  })
  console.log('  ✓ site-settings')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      primary: [
        { link: { label: 'Dine with us', type: 'internal', internalHref: '/dine-with-us' } },
        { link: { label: 'Get involved', type: 'internal', internalHref: '/get-involved' } },
        { link: { label: 'Our story', type: 'internal', internalHref: '/our-story' } },
      ],
      secondary: [
        { link: { label: 'The team', type: 'internal', internalHref: '/about/team' } },
        { link: { label: 'Journal', type: 'internal', internalHref: '/journal' } },
        { link: { label: 'Contact', type: 'internal', internalHref: '/contact' } },
        { link: { label: 'FAQs', type: 'internal', internalHref: '/faqs' } },
        { link: { label: 'Events', type: 'internal', internalHref: '/events' } },
        { link: { label: 'Newsletter', type: 'internal', internalHref: '/newsletter' } },
      ],
      ctas: {
        bookLabel: 'Book',
        donateLabel: 'Donate',
        shopLabel: 'Shop',
        showShop: true,
      },
    },
  })
  console.log('  ✓ navigation')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      tagline: 'Make a difference one plate at a time',
      columns: [
        {
          heading: 'Dine with us',
          links: [
            { link: { label: 'Onehunga', type: 'internal', internalHref: '/dine-with-us/onehunga' } },
            { link: { label: 'Glen Innes', type: 'internal', internalHref: '/dine-with-us/glen-innes' } },
            { link: { label: 'Wellington', type: 'internal', internalHref: '/dine-with-us/wellington' } },
            { link: { label: 'Pay at table', type: 'external', externalHref: 'https://www.everybodyeats.nz/dine-with-us/pay/all', openInNewTab: true } },
          ],
        },
        {
          heading: 'Get involved',
          links: [
            { link: { label: 'Volunteer', type: 'internal', internalHref: '/get-involved/volunteer' } },
            { link: { label: 'Donate', type: 'internal', internalHref: '/get-involved/donate' } },
            { link: { label: 'Partner', type: 'internal', internalHref: '/get-involved/partner' } },
            { link: { label: 'Events', type: 'internal', internalHref: '/events' } },
          ],
        },
        {
          heading: 'About us',
          links: [
            { link: { label: 'Our story', type: 'internal', internalHref: '/our-story' } },
            { link: { label: 'Team', type: 'internal', internalHref: '/about/team' } },
            { link: { label: 'Journal', type: 'internal', internalHref: '/journal' } },
          ],
        },
        {
          heading: 'More',
          links: [
            { link: { label: 'Newsletter', type: 'internal', internalHref: '/newsletter' } },
            { link: { label: 'Shop', type: 'external', externalHref: 'https://everybodyeatsnz.shop', openInNewTab: true } },
            { link: { label: 'Contact', type: 'internal', internalHref: '/contact' } },
            { link: { label: 'FAQs', type: 'internal', internalHref: '/faqs' } },
            { link: { label: 'Volunteer login', type: 'external', externalHref: 'https://volunteers.everybodyeats.nz', openInNewTab: true } },
          ],
        },
      ],
      legalLinks: [
        { link: { label: 'Terms & conditions', type: 'internal', internalHref: '/terms' } },
        { link: { label: 'Privacy policy', type: 'internal', internalHref: '/privacy' } },
      ],
      copyright: '© Everybody Eats',
    },
  })
  console.log('  ✓ footer')
}

async function seedPages(payload: any) {
  console.log('\n→ Pages')
  const homeHeroId = await uploadMedia(payload, '66da1b61c565fbd49ef16956_diners.jpg', 'Diners at Everybody Eats')
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      hero: {
        eyebrow: 'Pay-as-you-feel restaurants',
        heading: 'Making a difference one plate at a time',
        subheading:
          'Restaurant-quality meals from rescued ingredients, served on a pay-as-you-feel basis. Everyone is welcome at our table.',
        primaryCta: { label: 'Find a restaurant', href: '/dine-with-us' },
        image: homeHeroId,
      },
    },
    {
      slug: 'our-story',
      title: 'Our Story',
      hero: {
        eyebrow: 'About',
        heading: 'A movement built on rescued food and full tables',
      },
    },
    {
      slug: 'dine-with-us',
      title: 'Dine with us',
      hero: {
        eyebrow: 'Visit',
        heading: 'Three restaurants, one big table',
      },
    },
    {
      slug: 'get-involved',
      title: 'Get involved',
      hero: {
        eyebrow: 'Join in',
        heading: 'Be part of the change',
      },
    },
    {
      slug: 'contact',
      title: 'Contact us',
      hero: { heading: 'Get in touch' },
    },
    {
      slug: 'newsletter',
      title: 'Newsletter',
      hero: { heading: 'Stories, straight to your inbox' },
    },
  ]
  for (const p of pages) {
    await upsertBySlug(payload, 'pages', p.slug, p)
    console.log(`  ✓ ${p.title}`)
  }
}

async function main() {
  const payload = await getPayload({ config })
  console.log('Connected to Payload')

  console.log('\n→ Admin user')
  await ensureFirstUser(payload)

  await seedLocations(payload)
  await seedTeamMembers(payload)
  await seedQuotes(payload)
  await seedFaqs(payload)
  await seedPartners(payload)
  await seedEvents(payload)
  await seedJournalPosts(payload)
  await seedDailyMenus(payload)
  await seedGlobals(payload)
  await seedPages(payload)

  console.log('\n✓ Seed complete.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
