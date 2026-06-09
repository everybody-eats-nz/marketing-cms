import { renderRichText } from './render-text'

type Amount = { amount: number; label: string }

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    subheading?: string
    panelLabel?: string
    amounts?: Amount[]
    ctaLabel?: string
    ctaHref?: string
    footnote?: string
  }
  defaultDonateUrl?: string
  charityNumber?: string
}

export function DonateHeroBlock({ block, defaultDonateUrl, charityNumber }: Props) {
  const donateUrl = block.ctaHref || defaultDonateUrl || '#'
  const amounts = block.amounts || []

  return (
    <section className="bg-sun-200 grain relative overflow-hidden">
      <div className="container-wide pt-16 sm:pt-24 pb-20 grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          {block.eyebrow && <p className="eyebrow mb-5 text-forest-700/85">{block.eyebrow}</p>}
          {block.heading && (
            <h1 className="display text-5xl sm:text-7xl lg:text-[7.5rem] font-light leading-[0.95] text-forest-700">
              {renderRichText(block.heading)}
            </h1>
          )}
          {block.subheading && (
            <p className="mt-8 max-w-xl text-lg text-forest-700/85 leading-relaxed">
              {block.subheading}
            </p>
          )}
        </div>
        <div className="lg:col-span-5">
          <div className="bg-surface rounded-[2rem] p-8 sm:p-10 shadow-xl">
            {block.panelLabel && <p className="eyebrow mb-3">{block.panelLabel}</p>}
            {amounts.length > 0 && (
              <div className={`grid gap-3 mb-6 ${amounts.length === 4 ? 'grid-cols-4' : amounts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {amounts.map((a) => (
                  <a
                    key={a.amount}
                    href={`${donateUrl}?amount=${a.amount}`}
                    className="group border border-line/30 hover:bg-forest-500 hover:text-cream-50 hover:border-line rounded-2xl py-4 text-center transition-all"
                  >
                    <div className="display text-2xl font-medium">${a.amount}</div>
                    <div className="text-xs text-muted group-hover:text-cream-50/75 mt-1 transition-colors">
                      {a.label}
                    </div>
                  </a>
                ))}
              </div>
            )}
            <a href={donateUrl} className="btn-primary w-full justify-center">
              {block.ctaLabel || 'Donate now →'}
            </a>
            {(block.footnote || charityNumber) && (
              <p className="mt-4 text-xs text-muted/85 text-center">
                {block.footnote || `Registered charity ${charityNumber} · Receipts emailed.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
