import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'

type Params = { params: Promise<{ slug: string[] }> }

function joinSlug(parts: string[] | undefined) {
  return (parts || []).join('/')
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const { page } = await fetchPageDoc(joinSlug(slug))
  if (!page) return { title: 'Not found' }
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || undefined,
  }
}

export default async function GenericPage({ params }: Params) {
  const { slug } = await params
  const { page, isDraft } = await fetchPageDoc(joinSlug(slug))
  if (!page) notFound()
  return <PageBody page={page} isDraft={isDraft} />
}
