import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { PayloadImage } from '@/components/payload-image'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, recipes and dispatches from Everybody Eats.',
  alternates: { canonical: '/journal' },
}

export default async function JournalPage() {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: 'journal-posts',
    limit: 60,
    sort: '-publishedAt',
    depth: 1,
  })

  const [featured, ...rest] = posts as any[]

  return (
    <>
      <section className="container-wide pt-16 sm:pt-24 pb-16">
        <p className="eyebrow mb-5">Journal</p>
        <h1 className="display text-5xl sm:text-7xl lg:text-8xl font-light leading-[1] text-content">
          Stories from <em>the table</em>.
        </h1>
        <p className="mt-8 max-w-2xl text-lg sm:text-xl text-content/85 leading-relaxed">
          Dispatches from our kitchens, our diners, our partners, and the food we rescue.
        </p>
      </section>

      {featured && (
        <section className="container-wide pb-16">
          <Link
            href={`/journal/${featured.slug}`}
            className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-end"
          >
            <div className="lg:col-span-8 relative aspect-[3/2] rounded-[2.5rem] overflow-hidden bg-surface-3">
              {featured.mainImage ? (
                <PayloadImage
                  media={featured.mainImage}
                  size="hero"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted/85 mb-3">
                Featured · {featured.category || 'Story'}
              </p>
              <h2 className="display text-3xl sm:text-5xl font-light text-content leading-tight group-hover:underline underline-offset-4">
                {featured.title}
              </h2>
              {featured.summary && (
                <p className="mt-5 text-content/85 leading-relaxed line-clamp-4">
                  {featured.summary}
                </p>
              )}
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-muted group-hover:gap-3 transition-all">
                Read story <span>→</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="container-wide pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 gap-y-16">
          {rest.map((post: any) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-3 mb-5">
                {post.mainImage ? (
                  <PayloadImage
                    media={post.mainImage}
                    size="feature"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-clay-100 to-clay-200" />
                )}
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted/85 mb-2">
                {post.category || 'Story'}
              </p>
              <h3 className="display text-xl sm:text-2xl text-content font-medium leading-snug group-hover:underline underline-offset-4">
                {post.title}
              </h3>
              {post.summary && (
                <p className="mt-3 text-sm text-content/75 line-clamp-3">{post.summary}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
