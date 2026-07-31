import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'
import { JsonLd } from '@/components/structured-data'
import { SITE_URL, absoluteUrl, mediaUrl } from '@/lib/site-url'

// This static segment wins over (frontend)/[...slug] for /toast, so the page
// renders inside the chrome-free Toast layout instead of the main-site shell.
export const dynamic = 'force-dynamic'

const FALLBACK_TITLE = 'Toast — a pop-up community cafe from Everybody Eats'
const FALLBACK_DESCRIPTION =
  'Toast is Everybody Eats’ pop-up community cafe — inventive toppings on fresh sourdough, oats, Supreme coffee and housemade shrubs and cordials. Open Friday to Sunday.'

/**
 * Street address for the LocalBusiness card below. Left blank until the venue
 * is confirmed: an empty value drops `address` and `hasMap` from the structured
 * data rather than publishing a guess, which Google penalises. Fill all three
 * in together, and keep them matching the `toastVisit` block's copy.
 */
const STREET_ADDRESS: string = ''
const SUBURB: string = ''
const CITY: string = ''
const MAP_URL: string = ''

// LocalBusiness structured data so Toast is eligible for the Google local pack,
// Maps and rich results. Facts mirror the seed layout (scripts/seed-toast.ts);
// geo is intentionally omitted rather than guessed. Google reads this off the
// live page even though the page copy comes from the CMS.
const CAFE_JSONLD: Record<string, any> = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Toast',
  url: absoluteUrl('/toast'),
  description:
    'A pop-up community cafe from Everybody Eats — inventive toppings on fresh sourdough and oats, Supreme coffee, and housemade shrubs and cordials.',
  servesCuisine: 'Cafe',
  priceRange: '$',
  parentOrganization: { '@type': 'NGO', name: 'Everybody Eats', url: SITE_URL },
  ...(STREET_ADDRESS
    ? {
        address: {
          '@type': 'PostalAddress',
          streetAddress: STREET_ADDRESS,
          addressLocality: SUBURB,
          addressRegion: CITY,
          addressCountry: 'NZ',
        },
      }
    : {}),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday'],
      opens: '07:30',
      closes: '14:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '08:30',
      closes: '14:30',
    },
  ],
  ...(MAP_URL ? { hasMap: MAP_URL } : {}),
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await fetchPageDoc('toast')
  if (!page) return { title: 'Not found', robots: { index: false, follow: false } }
  const seo = (page as any).seo || {}
  const title = seo.title || FALLBACK_TITLE
  const description = seo.description || FALLBACK_DESCRIPTION
  // Per-page CMS image wins; otherwise leave images unset so the Toast-branded
  // opengraph-image.tsx in this route group fills in og:image + twitter:image.
  const ogImage = mediaUrl(seo.image, 'hero')
  return {
    title,
    description,
    alternates: { canonical: '/toast' },
    openGraph: {
      title,
      description,
      url: '/toast',
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

export default async function ToastPage() {
  const { page, isDraft } = await fetchPageDoc('toast')
  if (!page) notFound()
  return (
    <>
      <JsonLd data={CAFE_JSONLD} />
      <PageBody page={page} isDraft={isDraft} />
    </>
  )
}
