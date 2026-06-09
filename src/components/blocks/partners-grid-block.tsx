import Link from 'next/link'
import { PayloadImage } from '@/components/payload-image'
import { renderRichText } from './render-text'

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    viewAllLabel?: string
    viewAllHref?: string
  }
  partners: any[]
}

export function PartnersGridBlock({ block, partners }: Props) {
  if (!partners.length) return null
  const platinum = partners.filter((p) => p.tier === 'platinum')
  const others = partners.filter((p) => p.tier !== 'platinum')

  return (
    <section className="container-wide py-16 sm:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          {block.eyebrow && <p className="eyebrow mb-3">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl text-content font-light leading-tight">
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

      {platinum.length > 0 && (
        <div className="mb-12">
          <p className="eyebrow mb-6 text-muted/85">Platinum partners</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-line/15 rounded-2xl overflow-hidden">
            {platinum.map((p) => (
              <PartnerCard key={p.id} partner={p} large />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <>
          <p className="eyebrow mb-6 text-muted/85">All supporters</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10">
            {others.map((p) => (
              <PartnerCard key={p.id} partner={p} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function PartnerCard({ partner, large }: { partner: any; large?: boolean }) {
  const inner = (
    <div
      className={`relative ${
        large
          ? 'aspect-[4/3] bg-cream-50 p-6 sm:p-10'
          : 'aspect-square dark:bg-cream-50 dark:rounded-xl dark:p-3'
      } flex items-center justify-center transition-opacity hover:opacity-75`}
    >
      {partner.logo ? (
        <div className="relative w-full h-full">
          <PayloadImage media={partner.logo} size="card" fill sizes="200px" className="object-contain" />
        </div>
      ) : (
        <span className="display text-sm text-forest-700/70 text-center px-2">{partner.name}</span>
      )}
    </div>
  )
  if (partner.url) {
    return (
      <a href={partner.url} target="_blank" rel="noreferrer" title={partner.name}>
        {inner}
      </a>
    )
  }
  return inner
}
