import Link from 'next/link'
import { PayloadImage } from '@/components/payload-image'
import { renderRichText } from './render-text'

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    viewAllLabel?: string
    viewAllHref?: string
    limit?: number
  }
  journal: any[]
}

export function JournalListBlock({ block, journal }: Props) {
  const limit = block.limit || 3
  const docs = journal.slice(0, limit)
  if (!docs.length) return null

  return (
    <section className="container-wide py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl text-forest-700 font-light">
              {renderRichText(block.heading)}
            </h2>
          )}
        </div>
        {block.viewAllLabel && block.viewAllHref && (
          <Link href={block.viewAllHref} className="btn-ghost shrink-0">
            {block.viewAllLabel}
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {docs.map((post) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="group flex flex-col">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-forest-100 mb-5">
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
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-forest-500/70 mb-3">
              {post.category || 'Story'}
            </p>
            <h3 className="display text-xl sm:text-2xl text-forest-700 font-medium leading-snug group-hover:underline underline-offset-4">
              {post.title}
            </h3>
            {post.summary && (
              <p className="mt-3 text-sm text-forest-600/75 line-clamp-3">{post.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
