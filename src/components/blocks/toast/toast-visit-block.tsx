import { renderToastText } from './toast-text'
import './toast.css'

type Props = {
  block: {
    eyebrow?: string
    address?: string
    note?: string
    hours?: { days?: string; times?: string; id?: string }[] | null
    mapLabel?: string
    mapHref?: string
  }
}

export function ToastVisitBlock({ block }: Props) {
  const hours = (block.hours || []).filter((row) => row?.days && row?.times)
  const hasMap = Boolean(block.mapLabel && block.mapHref)
  // The two-column split only earns its keep when there is something in the
  // left column. Before the venue is confirmed there isn't, so the hours run
  // full width rather than sitting beside an empty half.
  const hasPlace = Boolean(block.address || block.note || hasMap)

  return (
    <section className="toast-scope">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="toast-rule mx-auto max-w-3xl border-t py-20 sm:py-28">
          {block.eyebrow && <p className="toast-label mb-10">{block.eyebrow}</p>}
          <div className={`grid gap-12 ${hasPlace ? 'sm:grid-cols-2' : ''}`}>
            {hasPlace && (
              <div>
                {block.address && (
                  <p className="whitespace-pre-line text-[clamp(1.25rem,2.5vw,1.625rem)] font-bold leading-snug tracking-tight">
                    {block.address}
                  </p>
                )}
                {block.note && (
                  <p className="mt-4 max-w-[40ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
                    {renderToastText(block.note)}
                  </p>
                )}
                {hasMap && (
                  <div className="mt-8">
                    <a
                      href={block.mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="toast-btn"
                    >
                      {block.mapLabel}
                    </a>
                  </div>
                )}
              </div>
            )}
            {hours.length > 0 && (
              <dl>
                {hours.map((row, i) => (
                  <div
                    key={row.id || i}
                    className={`flex items-baseline justify-between gap-6 py-4 ${
                      i > 0 ? 'toast-rule border-t' : ''
                    }`}
                  >
                    <dt className="toast-label">{row.days}</dt>
                    <dd className="toast-label opacity-70">{row.times}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
