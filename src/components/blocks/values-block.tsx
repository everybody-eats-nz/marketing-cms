import { renderRichText } from './render-text'

type Value = { term: string; translation?: string; copy?: string }

type Props = {
  block: {
    eyebrow?: string
    missionLabel?: string
    mission?: string
    visionLabel?: string
    vision?: string
    valuesLabel?: string
    items?: Value[]
  }
}

export function ValuesBlock({ block }: Props) {
  const items = block.items || []
  const hasMission = Boolean(block.mission)
  const hasVision = Boolean(block.vision)
  if (!hasMission && !hasVision && !items.length) return null

  return (
    <section className="bg-forest-700 text-cream-50 grain py-24 sm:py-32 relative overflow-hidden">
      <div className="container-wide relative z-10">
        {block.eyebrow && <p className="eyebrow text-cream-50/60 mb-10">{block.eyebrow}</p>}

        {(hasMission || hasVision) && (
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {hasMission && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-sun-200/80 mb-5">
                  {block.missionLabel || 'Our mission'}
                </p>
                <p className="display text-3xl sm:text-4xl font-light leading-[1.15] text-cream-50">
                  {renderRichText(block.mission)}
                </p>
              </div>
            )}
            {hasVision && (
              <div className="md:border-l md:border-cream-50/15 md:pl-16">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-sun-200/80 mb-5">
                  {block.visionLabel || 'Our vision'}
                </p>
                <p className="display text-3xl sm:text-4xl font-light leading-[1.15] text-cream-50">
                  {renderRichText(block.vision)}
                </p>
              </div>
            )}
          </div>
        )}

        {items.length > 0 && (
          <>
            {block.valuesLabel && (
              <p className="eyebrow text-cream-50/60 mt-20 mb-8">{block.valuesLabel}</p>
            )}
            <div
              className={`grid gap-px rounded-3xl overflow-hidden bg-cream-50/10 ${
                items.length >= 3 ? 'md:grid-cols-3' : items.length === 2 ? 'md:grid-cols-2' : ''
              }`}
            >
              {items.map((v, i) => (
                <div key={i} className="bg-forest-700 p-8 sm:p-10">
                  <h3 className="display text-3xl sm:text-4xl font-light text-sun-200">{v.term}</h3>
                  {v.translation && (
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-cream-50/55">
                      {v.translation}
                    </p>
                  )}
                  {v.copy && (
                    <p className="mt-5 text-cream-50/80 leading-relaxed">{v.copy}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-clay-300/10 blur-3xl pointer-events-none"
        aria-hidden
      />
    </section>
  )
}
