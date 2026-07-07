import { PlatesSymbol } from './plates-symbol'

export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  // Repeat twice so the loop is seamless
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="display text-3xl sm:text-5xl !leading-[1.3] inline-flex items-center gap-12">
            <span>{item}</span>
            <PlatesSymbol className="h-6 w-auto sm:h-9 text-sun-300 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
