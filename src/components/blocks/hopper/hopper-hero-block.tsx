import Link from 'next/link'
import './hopper.css'

type Props = {
  block: {
    kicker?: string
    kickerHref?: string
    wordmark?: string
    label?: string
    addressLine?: string
    hoursLine?: string
  }
}

export function HopperHeroBlock({ block }: Props) {
  const word = block.wordmark || 'hOPPer'
  return (
    <section className="hopper-scope">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 pb-10 pt-8 sm:px-10">
        <div className="flex justify-center">
          <Link
            href={block.kickerHref || '/'}
            aria-label={block.kicker || 'Everybody Eats'}
            className="transition-opacity hover:opacity-70"
          >
            <span className="hopper-ee-logo h-8 sm:h-10 aspect-[179/65]" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <h1
            aria-label={`${word} ${block.label || ''}`.trim()}
            className="hopper-display hopper-wordmark leading-none tracking-[-0.12em] text-[clamp(4rem,24vw,21rem)]"
          >
            {[...word].map((letter, i) => (
              <span key={i} aria-hidden style={{ '--i': i } as React.CSSProperties}>
                {letter}
              </span>
            ))}
          </h1>
          {block.label && (
            <p className="hopper-label mt-8 !tracking-[0.6em] pl-[0.6em] sm:text-sm">{block.label}</p>
          )}
        </div>

        <div className="hopper-rule flex flex-col items-center justify-between gap-3 border-t pt-6 text-center sm:flex-row sm:text-left">
          {block.addressLine && <p className="hopper-label">{block.addressLine}</p>}
          {block.hoursLine && <p className="hopper-label">{block.hoursLine}</p>}
        </div>
      </div>
    </section>
  )
}
