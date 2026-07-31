import Image from 'next/image'
import Link from 'next/link'
import './toast.css'

// Natural proportions of public/toast-logo.svg (the drawn wordmark, trimmed to
// its own bounding box). Passed to next/image so the space is reserved before
// the asset lands and the hero never reflows.
const WORDMARK = { width: 183, height: 59 }

type Props = {
  block: {
    kicker?: string
    kickerHref?: string
    label?: string
    addressLine?: string
    hoursLine?: string
  }
}

export function ToastHeroBlock({ block }: Props) {
  return (
    <section className="toast-scope">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 pb-10 pt-8 sm:px-10">
        <div className="flex justify-center">
          <Link
            href={block.kickerHref || '/'}
            aria-label={block.kicker || 'Everybody Eats'}
            className="transition-opacity hover:opacity-70"
          >
            <span className="toast-ee-logo h-8 sm:h-10 aspect-[179/65]" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <h1 className="flex justify-center">
            <Image
              src="/toast-logo.svg"
              alt="Toast"
              width={WORDMARK.width}
              height={WORDMARK.height}
              className="toast-wordmark"
              priority
            />
          </h1>
          {block.label && (
            <p className="toast-label mt-10 !tracking-[0.5em] pl-[0.5em] sm:text-sm">
              {block.label}
            </p>
          )}
        </div>

        <div className="toast-rule flex flex-col items-center justify-between gap-3 border-t pt-6 text-center sm:flex-row sm:text-left">
          {block.addressLine && <p className="toast-label">{block.addressLine}</p>}
          {block.hoursLine && <p className="toast-label">{block.hoursLine}</p>}
        </div>
      </div>
    </section>
  )
}
