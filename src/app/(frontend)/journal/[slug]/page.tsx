import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { JsonLd, buildBlogPosting, buildBreadcrumbs } from '@/components/structured-data'
import { PayloadImage } from '@/components/payload-image'
import { RichText } from '@/components/rich-text'

type Params = { params: Promise<{ slug: string }> }

async function fetchPost(slug: string) {
  // In Payload preview (draftMode) show the latest draft; otherwise only the
  // published version, so draft posts 404 publicly and match the sitemap. This
  // mirrors page-body.tsx and is ready for `livePreview` on the journal collection.
  const { isEnabled } = await draftMode()
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'journal-posts',
    draft: isEnabled,
    where: isEnabled
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return docs[0] || null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post: any = await fetchPost(slug)
  if (!post) return { title: 'Not found', robots: { index: false, follow: false } }
  return pageMetadata({
    title: post.title,
    description: post.summary,
    image: post.mainImage,
    noindex: post.seo?.noindex,
    path: `/journal/${post.slug}`,
    type: 'article',
  })
}

export default async function JournalPost({ params }: Params) {
  const { slug } = await params
  const post: any = await fetchPost(slug)
  if (!post) notFound()

  const published = post.publishedAt ? new Date(post.publishedAt) : null

  return (
    <>
      <JsonLd data={buildBlogPosting(post)} />
      <JsonLd
        data={buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Journal', path: '/journal' },
          { name: post.title, path: `/journal/${post.slug}` },
        ])}
      />
      <article className="container-tight pt-12 sm:pt-20 pb-12">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-sm text-muted/85 hover:text-content mb-10"
        >
          <span>←</span> All stories
        </Link>

        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted/85 mb-5">
          {post.category || 'Story'}
          {published && <> · {published.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</>}
        </p>
        <h1 className="display text-4xl sm:text-6xl lg:text-7xl text-content font-light leading-[1.05]">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-8 display text-xl sm:text-2xl text-content/85 leading-relaxed max-w-3xl font-light">
            {post.summary}
          </p>
        )}
        {post.author && (
          <p className="mt-8 text-sm text-muted/85">By {post.author}</p>
        )}
      </article>

      {post.mainImage && (
        <div className="container-wide mb-12">
          <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-surface-3">
            <PayloadImage
              media={post.mainImage}
              size="hero"
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {post.body && (
        <section className="container-tight pb-24">
          <RichText content={post.body} />
        </section>
      )}

      <section className="container-wide pb-32">
        <div className="rounded-[2.5rem] bg-forest-700 grain text-cream-50 p-10 sm:p-16">
          <p className="eyebrow text-cream-50/70 mb-4">Keep reading</p>
          <h2 className="display text-3xl sm:text-5xl font-light max-w-3xl">
            More <em className="text-sun-200">stories</em> from the table.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/journal" className="btn-accent">All stories</Link>
            <Link href="/newsletter" className="btn border border-cream-50/40 text-cream-50 hover:bg-surface hover:text-content">
              Subscribe →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
