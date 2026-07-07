import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'

// This static segment wins over (frontend)/[...slug] for /hopper, so the page
// renders inside the chrome-free Hopper layout instead of the main-site shell.
export const dynamic = 'force-dynamic'

const FALLBACK_TITLE = 'Hopper Cafe — 11 Hopper St, Te Aro, Wellington'
const FALLBACK_DESCRIPTION =
  'Hopper is a cafe from Everybody Eats at 11 Hopper St, Te Aro — rescued food, accessible prices, and a genuine sense of belonging. Open Monday and Tuesday, 9am to 2pm.'

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await fetchPageDoc('hopper')
  if (!page) return { title: 'Not found', robots: { index: false, follow: false } }
  const seo = (page as any).seo || {}
  return {
    title: seo.title || FALLBACK_TITLE,
    description: seo.description || FALLBACK_DESCRIPTION,
    alternates: { canonical: '/hopper' },
    openGraph: {
      title: seo.title || FALLBACK_TITLE,
      description: seo.description || FALLBACK_DESCRIPTION,
      type: 'website',
    },
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function HopperPage() {
  const { page, isDraft } = await fetchPageDoc('hopper')
  if (!page) notFound()
  return <PageBody page={page} isDraft={isDraft} />
}
