import './hopper.css'

type Props = {
  block: {
    eyebrow?: string
    items?: { name?: string; note?: string; id?: string }[] | null
    footnote?: string
  }
}

export function HopperMenuBlock({ block }: Props) {
  const items = (block.items || []).filter((it) => it?.name)
  if (!items.length) return null
  return (
    <section className="hopper-scope">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="hopper-rule mx-auto max-w-3xl border-t py-20 sm:py-28">
          {block.eyebrow && <p className="hopper-label mb-10">{block.eyebrow}</p>}
          <ul>
            {items.map((item, i) => (
              <li
                key={item.id || i}
                className={`hopper-menu-item flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                  i > 0 ? 'hopper-rule border-t' : ''
                }`}
              >
                <span className="hopper-display lowercase leading-none tracking-[-0.02em] text-[clamp(2rem,5.5vw,3.5rem)]">
                  {item.name}
                </span>
                {item.note && <span className="hopper-label shrink-0 opacity-70">{item.note}</span>}
              </li>
            ))}
          </ul>
          {block.footnote && (
            <p className="mt-10 max-w-[52ch] whitespace-pre-line text-[0.9375rem] leading-[1.8] opacity-80">
              {block.footnote}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
