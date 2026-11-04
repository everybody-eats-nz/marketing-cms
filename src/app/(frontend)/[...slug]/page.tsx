import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPageDoc, PageBody } from '@/components/blocks/page-body'
import { NOT_FOUND_METADATA, pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ slug: string[] }> }

function joinSlug(parts: string[] | undefined) {
  return (parts || []).join('/')
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const path = joinSlug(slug)
  const { page } = await fetchPageDoc(path)
  if (!page) return NOT_FOUND_METADATA
  return pageMetadata({
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    image: page.seo?.image,
    noindex: page.seo?.noindex,
    path: `/${path}`,
  })
}

export default async function GenericPage({ params }: Params) {
  const { slug } = await params
  const { page, isDraft } = await fetchPageDoc(joinSlug(slug))
  if (!page) notFound()
  return <PageBody page={page} isDraft={isDraft} />
}
