import type { Metadata } from 'next'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'
import { getSiteSettings, pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, settings] = await Promise.all([fetchPageDoc('home'), getSiteSettings()])
  const siteName = settings?.siteName || 'Everybody Eats'
  const tagline = settings?.tagline || 'Pay-as-you-feel restaurants in Aotearoa'
  // The home page is in the same route segment as the layout, so the title
  // template ('%s — Everybody Eats') does NOT apply here — supply the full,
  // brand-led title explicitly.
  return pageMetadata({
    title: page?.seo?.title || `${siteName} — ${tagline}`,
    absoluteTitle: true,
    description: page?.seo?.description,
    image: page?.seo?.image,
    noindex: page?.seo?.noindex,
    path: '/',
  })
}

export default async function HomePage() {
  const { page, isDraft } = await fetchPageDoc('home')
  if (!page) {
    // Home doc missing — render an empty fallback rather than 404 so dev environments still boot.
    return (
      <section className="container-wide pt-32 pb-32 text-center">
        <h1 className="display text-4xl text-content">
          No <em>home</em> page yet
        </h1>
        <p className="mt-4 text-content/80">
          Create a Page with slug <code>home</code> in the admin to populate this route.
        </p>
      </section>
    )
  }
  return <PageBody page={page} isDraft={isDraft} />
}
