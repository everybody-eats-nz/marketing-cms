import Link from 'next/link'
import { KawakawaPattern } from '@/components/kawakawa-pattern'
import { DiningRoomMural } from '@/components/dining-room-mural'
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
    tertiaryCta?: CTA
  }
}

export function CtaStripBlock({ block }: Props) {
  const isSun = block.variant !== 'forest'
  const isCentered = block.align === 'center'
  const primary = block.primaryCta
  const secondary = block.secondaryCta
  const tertiary = block.tertiaryCta
  const ghostClass = isSun
    ? 'btn-ghost border-forest-700/30 text-forest-700 hover:bg-forest-700 hover:text-cream-50 dark:border-sun-200/30 dark:text-sun-200/80 dark:hover:bg-sun-200 dark:hover:text-forest-700 dark:hover:border-sun-200'
    : 'btn-ghost border-cream-50/30 text-cream-50 hover:bg-surface hover:text-content'

  return (
    <section className="container-wide pt-12 pb-24">
      <div
        className={`relative overflow-hidden rounded-[3rem] p-10 sm:p-16 grain ${
          isSun ? 'bg-sun-200 dark:bg-surface-2 dark:ring-1 dark:ring-line/15' : 'bg-forest-700'
        } ${isCentered ? 'text-center' : ''}`}
      >
        <div
          className={`relative z-10 ${isCentered ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}
        >
          {block.heading && (
            <h2
              className={`display text-4xl sm:text-6xl font-light leading-tight ${
                isSun ? 'text-forest-700 dark:text-content' : 'text-cream-50'
              } ${isCentered ? 'mx-auto' : ''}`}
            >
              {renderRichText(block.heading)}
            </h2>
          )}
          {block.body && (
            <p
              className={`mt-6 text-lg ${
                isSun ? 'text-forest-700/85 dark:text-content/75' : 'text-cream-50/85'
              } ${isCentered ? 'mx-auto max-w-xl' : 'max-w-xl'}`}
            >
              {block.body}
            </p>
          )}
          {(primary?.label && primary?.href) ||
          (secondary?.label && secondary?.href) ||
          (tertiary?.label && tertiary?.href) ? (
            <div className={`mt-8 flex flex-wrap gap-3 ${isCentered ? 'justify-center' : ''}`}>
              {primary?.label && primary?.href && (
                <Link href={primary.href} className="btn-primary px-7 py-3.5">
                  {primary.label}
                </Link>
              )}
              {secondary?.label && secondary?.href && (
                <Link href={secondary.href} className={ghostClass}>
                  {secondary.label}
                </Link>
              )}
              {tertiary?.label && tertiary?.href && (
                <Link href={tertiary.href} className={ghostClass}>
                  {tertiary.label}
                </Link>
              )}
            </div>
          ) : null}
        </div>
        {!isCentered &&
          (isSun ? (
            <KawakawaPattern
              // The sun variant goes dark-surface in dark mode, where the green
              // doodles are tone-on-tone — let them through stronger there.
              className="top-0 -right-8 w-80 sm:w-[26rem] opacity-25 dark:opacity-80"
            />
          ) : (
            // On the dark forest band the dining-room line-art reads in cream —
            // bled off the bottom-right corner behind the copy.
            <DiningRoomMural className="absolute -bottom-8 -right-10 w-[34rem] sm:w-[44rem] aspect-[1280/759] text-cream-50/[0.08]" />
          ))}
      </div>
    </section>
  )
}
