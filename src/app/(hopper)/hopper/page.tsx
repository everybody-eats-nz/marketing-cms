import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'
import { JsonLd } from '@/components/structured-data'
import { SITE_URL, absoluteUrl, mediaUrl } from '@/lib/site-url'

// This static segment wins over (frontend)/[...slug] for /hopper, so the page
// renders inside the chrome-free Hopper layout instead of the main-site shell.
export const dynamic = 'force-dynamic'

const FALLBACK_TITLE = 'Hopper Cafe — 11 Hopper St, Te Aro, Wellington'
const FALLBACK_DESCRIPTION =
  'Hopper is a cafe from Everybody Eats at 11 Hopper St, Te Aro — rescued food, accessible prices, and a genuine sense of belonging. Open Monday and Tuesday, 9am to 2pm.'

// LocalBusiness structured data so Hopper is eligible for the Google local pack,
// Maps and rich results. Facts mirror the seed layout (scripts/seed-hopper.ts);
// geo is intentionally omitted rather than guessed. Google reads this off the
// live page even though the page copy comes from the CMS.
const CAFE_JSONLD: Record<string, any> = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Hopper Cafe',
  url: absoluteUrl('/hopper'),
  description:
    'A cafe from Everybody Eats — rescued food, accessible prices, and a genuine sense of belonging.',
  servesCuisine: 'Cafe',
  priceRange: '$',
  parentOrganization: { '@type': 'NGO', name: 'Everybody Eats', url: SITE_URL },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '11 Hopper Street',
    addressLocality: 'Te Aro',
    addressRegion: 'Wellington',
    addressCountry: 'NZ',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday'],
      opens: '09:00',
      closes: '14:00',
    },
  ],
  hasMap: 'https://maps.google.com/?q=11+Hopper+Street,+Te+Aro,+Wellington',
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await fetchPageDoc('hopper')
  if (!page) return { title: 'Not found', robots: { index: false, follow: false } }
  const seo = (page as any).seo || {}
  const title = seo.title || FALLBACK_TITLE
  const description = seo.description || FALLBACK_DESCRIPTION
  // Per-page CMS image wins; otherwise leave images unset so the Hopper-branded
  // opengraph-image.tsx in this route group fills in og:image + twitter:image.
  const ogImage = mediaUrl(seo.image, 'hero')
  return {
    title,
    description,
    alternates: { canonical: '/hopper' },
    openGraph: {
      title,
      description,
      url: '/hopper',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function HopperPage() {
  const { page, isDraft } = await fetchPageDoc('hopper')
  if (!page) notFound()
  return (
    <>
      <JsonLd data={CAFE_JSONLD} />
      <PageBody page={page} isDraft={isDraft} />
    </>
  )
}
