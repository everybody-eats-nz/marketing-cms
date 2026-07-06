import React from 'react'
import { PayloadImage } from '@/components/payload-image'
import { HeroCarousel } from './hero-carousel'
import { HERO_IMAGES } from './hero-images'

type CTA = { label?: string; href?: string } | null | undefined

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    highlightWord?: string
    subheading?: string
    image?: any
    primaryCta?: CTA
    secondaryCta?: CTA
    sticker?: { text?: string } | null
  }
  fallbackHeading?: string
}

// Renders a chunk of plain text, optionally wrapping the first occurrence of `highlight` in the sun-underline span.
function renderTextWithHighlight(text: string, highlight: string | undefined, keyBase: string) {
  if (!highlight) return <React.Fragment key={keyBase}>{text}</React.Fragment>
  const idx = text.indexOf(highlight)
  if (idx === -1) return <React.Fragment key={keyBase}>{text}</React.Fragment>
  const before = text.slice(0, idx)
  const after = text.slice(idx + highlight.length)
  return (
    <React.Fragment key={keyBase}>
      {before}
      <span className="relative inline-block">
        {highlight}
        <span
          className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-sun-200 -z-10 rounded-full"
          aria-hidden
        />
      </span>
      {after}
    </React.Fragment>
  )
}

// Splits on *em* markers and newlines. Highlights only apply to non-em segments.
function renderRichInline(text: string, highlight?: string) {
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*]+\*)/g)
    const rendered = parts.map((part, partIdx) => {
      const key = `${lineIdx}-${partIdx}`
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={key}>{part.slice(1, -1)}</em>
      }
      return renderTextWithHighlight(part, highlight, key)
    })
    return (
      <React.Fragment key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    )
  })
}

export function HeroBlock({ block, fallbackHeading }: Props) {
  const heading = block.heading || fallbackHeading || ''
  const primary = block.primaryCta
  const secondary = block.secondaryCta
  const stickerLines = block.sticker?.text?.split('\n').filter((l) => l.trim().length > 0) || []
  // A CMS-set image replaces the built-in carousel. Unpopulated relations
  // (bare ids) fall through to the carousel rather than rendering nothing.
  const cmsImage = block.image && typeof block.image === 'object' ? block.image : null

  return (
    <section className="relative overflow-hidden grain pt-12 sm:pt-20 pb-20 sm:pb-28">
      <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
        <div className="lg:col-span-7 relative z-10">
          {block.eyebrow && (
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-line/50" />
              {block.eyebrow}
            </p>
          )}
          <h1 className="display text-5xl sm:text-7xl lg:text-[7.5rem] font-light leading-[0.95] text-content">
            {renderRichInline(heading, block.highlightWord)}
          </h1>
          {block.subheading && (
            <p className="mt-8 text-lg sm:text-xl max-w-2xl text-content/85 leading-relaxed">
              {block.subheading}
            </p>
          )}
          {(primary?.label && primary?.href) || (secondary?.label && secondary?.href) ? (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {primary?.label && primary?.href && (
                <a href={primary.href} className="btn-primary text-base px-7 py-3.5">
                  {primary.label}
                </a>
              )}
              {secondary?.label && secondary?.href && (
                <a href={secondary.href} className="btn-ghost text-sm">
                  {secondary.label}
                </a>
              )}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5 relative">
          <div className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-surface-3 shadow-2xl">
            {cmsImage ? (
              <PayloadImage
                media={cmsImage}
                size="hero"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            ) : (
              <HeroCarousel images={HERO_IMAGES} />
            )}
            {stickerLines.length > 0 && (
              <div
                className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-32 h-32 sm:w-40 sm:h-40 grid place-items-center rounded-full bg-sun-200 text-forest-700 rotate-12 shadow-xl"
                aria-hidden
              >
                <span className="display text-center text-sm sm:text-base leading-tight font-medium">
                  {stickerLines.map((line, i) => (
                    <React.Fragment key={i}>
                      {renderRichInline(line)}
                      {i < stickerLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
