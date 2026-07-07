import type { ReactNode } from 'react'
import './hopper.css'

// Renders a plain-text note, turning inline [label](href) markdown links into
// anchors. External (http) links open in a new tab. Everything else passes
// through untouched, so whitespace-pre-line still handles line breaks.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function renderNote(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, href] = match
    const start = match.index ?? 0
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start))
    const external = /^https?:\/\//i.test(href)
    nodes.push(
      <a
        key={start}
        href={href}
        className="hopper-inline-link"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>,
    )
    lastIndex = start + full.length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

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

export function HopperVisitBlock({ block }: Props) {
  const hours = (block.hours || []).filter((row) => row?.days && row?.times)
  return (
    <section className="hopper-scope">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="hopper-rule mx-auto max-w-3xl border-t py-20 sm:py-28">
          {block.eyebrow && <p className="hopper-label mb-10">{block.eyebrow}</p>}
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              {block.address && (
                <p className="whitespace-pre-line text-[clamp(1.25rem,2.5vw,1.625rem)] font-bold leading-snug tracking-tight">
                  {block.address}
                </p>
              )}
              {block.note && (
                <p className="mt-4 max-w-[40ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
                  {renderNote(block.note)}
                </p>
              )}
              {block.mapLabel && block.mapHref && (
                <div className="mt-8">
                  <a href={block.mapHref} target="_blank" rel="noopener noreferrer" className="hopper-btn">
                    {block.mapLabel}
                  </a>
                </div>
              )}
            </div>
            {hours.length > 0 && (
              <dl>
                {hours.map((row, i) => (
                  <div
                    key={row.id || i}
                    className={`flex items-baseline justify-between gap-6 py-4 ${
                      i > 0 ? 'hopper-rule border-t' : ''
                    }`}
                  >
                    <dt className="hopper-label">{row.days}</dt>
                    <dd className="hopper-label opacity-70">{row.times}</dd>
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
