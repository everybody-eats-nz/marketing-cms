import Link from 'next/link'
import { renderRichText } from './render-text'

type CTA = { label?: string; href?: string } | null | undefined

type Props = {
  block: {
    heading?: string
    body?: string
    variant?: 'sun' | 'forest'
    align?: 'left' | 'center'
    primaryCta?: CTA
    secondaryCta?: CTA
  }
}

export function CtaStripBlock({ block }: Props) {
  const isSun = block.variant !== 'forest'
  const isCentered = block.align === 'center'
  const primary = block.primaryCta
  const secondary = block.secondaryCta

  return (
    <section className="container-wide pt-12 pb-24">
      <div
        className={`relative overflow-hidden rounded-[3rem] p-10 sm:p-16 grain ${
          isSun ? 'bg-sun-200' : 'bg-forest-700'
        } ${isCentered ? 'text-center' : ''}`}
      >
        <div
          className={`relative z-10 ${isCentered ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}
        >
          {block.heading && (
            <h2
              className={`display text-4xl sm:text-6xl font-light leading-tight ${
                isSun ? 'text-forest-700' : 'text-cream-50'
              } ${isCentered ? 'mx-auto' : ''}`}
            >
              {renderRichText(block.heading)}
            </h2>
          )}
          {block.body && (
            <p
              className={`mt-6 text-lg ${
                isSun ? 'text-forest-700/85' : 'text-cream-50/85'
              } ${isCentered ? 'mx-auto max-w-xl' : 'max-w-xl'}`}
            >
              {block.body}
            </p>
          )}
          {(primary?.label && primary?.href) || (secondary?.label && secondary?.href) ? (
            <div className={`mt-8 flex flex-wrap gap-3 ${isCentered ? 'justify-center' : ''}`}>
              {primary?.label && primary?.href && (
                <Link href={primary.href} className="btn-primary px-7 py-3.5">
                  {primary.label}
                </Link>
              )}
              {secondary?.label && secondary?.href && (
                <Link
                  href={secondary.href}
                  className={
                    isSun
                      ? 'btn-ghost border-forest-700/30 text-forest-700 hover:bg-forest-700 hover:text-cream-50'
                      : 'btn-ghost border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-forest-700'
                  }
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          ) : null}
        </div>
        {!isCentered && (
          <svg
            viewBox="0 0 240 240"
            className={`absolute -right-12 -bottom-12 w-72 h-72 sm:w-96 sm:h-96 ${
              isSun ? 'text-forest-700/15' : 'text-sun-200/15'
            }`}
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M120 0c5 56 64 116 120 120-56 5-115 64-120 120-5-56-64-115-120-120C56 115 115 56 120 0z"
            />
          </svg>
        )}
      </div>
    </section>
  )
}
