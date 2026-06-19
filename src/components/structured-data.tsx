import { SITE_URL, absoluteUrl, mediaUrl } from '@/lib/site-url'

/**
 * Renders a JSON-LD <script>. `<` is escaped so structured content can never
 * break out of the script element.
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

function socialUrls(settings: any): string[] {
  const social: any[] = Array.isArray(settings?.social) ? settings.social : []
  return social
    .map((s) => s?.url)
    .filter((u: any): u is string => typeof u === 'string' && u.length > 0)
}

/** Organization / NGO node — rendered site-wide from the layout. */
export function buildOrganization(settings: any): Record<string, any> {
  const name = settings?.siteName || 'Everybody Eats'
  const logo = mediaUrl(settings?.logoDark, 'card') || absoluteUrl('/everybody-eats-logo.svg')
  const sameAs = socialUrls(settings)
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'Organization'],
    name,
    url: SITE_URL,
    logo,
    description:
      settings?.description ||
      'A New Zealand pay-as-you-feel charity serving restaurant-quality meals made from rescued food.',
    ...(settings?.charityNumber
      ? {
          // NZ Charities Register number (e.g. CC56055)
          identifier: { '@type': 'PropertyValue', name: 'NZ Charity Number', value: settings.charityNumber },
        }
      : {}),
  }
  if (sameAs.length) data.sameAs = sameAs
  const contactEmail = settings?.contactEmail
  const phone = settings?.phone
  if (contactEmail || phone) {
    data.contactPoint = {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      ...(contactEmail ? { email: contactEmail } : {}),
      ...(phone ? { telephone: phone } : {}),
    }
  }
  return data
}

/** Restaurant node for an individual location page. */
export function buildRestaurant(loc: any): Record<string, any> {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: `Everybody Eats — ${loc.name}`,
    url: absoluteUrl(`/dine-with-us/${loc.slug}`),
    description: loc.tagline || loc.intro || undefined,
    servesCuisine: 'Pay-as-you-feel',
    priceRange: 'Pay what you can',
    acceptsReservations: !!loc.bookingUrl,
    parentOrganization: { '@type': 'NGO', name: 'Everybody Eats', url: SITE_URL },
  }
  const image = mediaUrl(loc.heroImage, 'hero')
  if (image) data.image = image
  if (loc.phone) data.telephone = loc.phone
  if (loc.email) data.email = loc.email
  if (loc.address || loc.city) {
    data.address = {
      '@type': 'PostalAddress',
      ...(loc.address ? { streetAddress: String(loc.address).replace(/\n+/g, ', ') } : {}),
      ...(loc.city ? { addressLocality: loc.city } : {}),
      addressCountry: 'NZ',
    }
  }
  const lat = loc.coordinates?.lat
  const lng = loc.coordinates?.lng
  if (typeof lat === 'number' && typeof lng === 'number') {
    data.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
  }
  return data
}

/** Flatten a Lexical richText value to plain text (for FAQ answers). */
function lexicalToText(value: any): string {
  const root = value?.root
  if (!root) return ''
  const walk = (node: any): string => {
    if (!node) return ''
    if (typeof node.text === 'string') return node.text
    if (Array.isArray(node.children)) return node.children.map(walk).join('')
    return ''
  }
  return (root.children || [])
    .map((n: any) => walk(n))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** FAQPage node built from the faqs collection (question + richText answer). */
export function buildFaqPage(faqs: any[]): Record<string, any> | null {
  const entries = (faqs || [])
    .map((f) => ({ q: f?.question, a: lexicalToText(f?.answer) }))
    .filter((e) => e.q && e.a)
  if (!entries.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: { '@type': 'Answer', text: e.a },
    })),
  }
}

/** Event node for an event detail page. */
export function buildEvent(ev: any): Record<string, any> {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.name,
    url: absoluteUrl(`/events/${ev.slug}`),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: { '@type': 'NGO', name: 'Everybody Eats', url: SITE_URL },
  }
  if (ev.date) data.startDate = ev.date
  if (ev.shortDescription) data.description = ev.shortDescription
  const image = mediaUrl(ev.image, 'feature')
  if (image) data.image = image
  const loc = typeof ev.location === 'object' ? ev.location : null
  if (loc) {
    data.location = {
      '@type': 'Place',
      name: `Everybody Eats — ${loc.name}`,
      ...(loc.address
        ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: String(loc.address).replace(/\n+/g, ', '),
              ...(loc.city ? { addressLocality: loc.city } : {}),
              addressCountry: 'NZ',
            },
          }
        : {}),
    }
  }
  const ticketUrl = ev.tickets?.ticketUrl
  if (ticketUrl) {
    data.offers = {
      '@type': 'Offer',
      url: ticketUrl,
      ...(ev.tickets?.priceLabel ? { description: ev.tickets.priceLabel } : {}),
      availability: 'https://schema.org/InStock',
    }
  }
  return data
}

/** BlogPosting node for a journal article. */
export function buildBlogPosting(post: any): Record<string, any> {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: absoluteUrl(`/journal/${post.slug}`),
    publisher: { '@type': 'NGO', name: 'Everybody Eats', url: SITE_URL },
  }
  if (post.summary) data.description = post.summary
  if (post.publishedAt) data.datePublished = post.publishedAt
  if (post.updatedAt) data.dateModified = post.updatedAt
  const author = post.author || (typeof post.authorMember === 'object' ? post.authorMember?.name : null)
  if (author) data.author = { '@type': 'Person', name: author }
  const image = mediaUrl(post.mainImage, 'feature')
  if (image) data.image = image
  return data
}

/** BreadcrumbList from an ordered list of { name, path } crumbs. */
export function buildBreadcrumbs(items: { name: string; path: string }[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
