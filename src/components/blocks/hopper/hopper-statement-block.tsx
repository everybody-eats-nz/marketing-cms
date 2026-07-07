import Link from 'next/link'
import './hopper.css'

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    body?: string
    cta?: { label?: string; href?: string } | null
  }
}

export function HopperStatementBlock({ block }: Props) {
  const cta = block.cta
  return (
    <section className="hopper-scope">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="hopper-rule mx-auto max-w-3xl border-t py-20 sm:py-28">
          {block.eyebrow && <p className="hopper-label mb-8">{block.eyebrow}</p>}
          {block.heading && (
            <h2 className="whitespace-pre-line text-[clamp(1.5rem,3.5vw,2.375rem)] font-bold leading-[1.25] tracking-tight">
              {block.heading}
            </h2>
          )}
          {block.body && (
            <p className="mt-6 max-w-[52ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
              {block.body}
            </p>
          )}
          {cta?.label && cta?.href && (
            <div className="mt-10">
              <Link href={cta.href} className="hopper-btn">
                {cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
