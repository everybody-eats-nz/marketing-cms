import type { Metadata } from 'next'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await fetchPageDoc('home')
  if (!page) return { title: 'Everybody Eats' }
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || undefined,
  }
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
