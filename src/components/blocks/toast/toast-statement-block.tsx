import Link from 'next/link'
import { PayloadImage } from '@/components/payload-image'
import { renderToastText } from './toast-text'
import './toast.css'

type Aside = {
  image?: any
  label?: string
  href?: string
} | null

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    body?: string
    cta?: { label?: string; href?: string } | null
    aside?: Aside
  }
}

function AsideLogo({ aside }: { aside: NonNullable<Aside> }) {
  const external = /^https?:\/\//i.test(aside.href || '')
  const logo = (
    <PayloadImage
      media={aside.image}
      alt={aside.image?.alt || ''}
      size="card"
      className="toast-partner-logo"
      sizes="208px"
    />
  )
  return (
    <div className="flex max-w-[13rem] flex-col gap-4">
      {aside.label && <p className="toast-label opacity-70">{aside.label}</p>}
      {aside.href ? (
        <Link
          href={aside.href}
          className="block transition-opacity hover:opacity-70"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {logo}
        </Link>
      ) : (
        logo
      )}
    </div>
  )
}

export function ToastStatementBlock({ block }: Props) {
  const cta = block.cta
  // Only a populated (object) upload can render — an unpopulated relationship
  // comes back as a bare id.
  const aside =
    block.aside && typeof block.aside.image === 'object' && block.aside.image ? block.aside : null

  return (
    <section className="toast-scope">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="toast-rule mx-auto max-w-3xl border-t py-20 sm:py-28">
          {block.eyebrow && <p className="toast-label mb-8">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="whitespace-pre-line text-[clamp(1.5rem,3.5vw,2.375rem)] font-bold leading-[1.25] tracking-tight">
              {block.heading}
            </h2>
          )}

          {/* The logo sits alongside the copy on wide screens and drops below it
              on narrow ones, where a side-by-side would squeeze both. */}
          <div
            className={
              aside ? 'grid items-center gap-10 sm:grid-cols-[minmax(0,1fr)_13rem] sm:gap-14' : ''
            }
          >
            <div>
              {block.body && (
                <p className="mt-6 max-w-[52ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
                  {renderToastText(block.body)}
                </p>
              )}
              {cta?.label && cta?.href && (
                <div className="mt-10">
                  <Link href={cta.href} className="toast-btn">
                    {cta.label}
                  </Link>
                </div>
              )}
            </div>
            {aside && <AsideLogo aside={aside} />}
          </div>
        </div>
      </div>
    </section>
  )
}
