export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  // Repeat twice so the loop is seamless
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="display text-3xl sm:text-5xl !leading-[1.3] inline-flex items-center gap-12">
            <span>{item}</span>
            <Sparkle />
          </span>
        ))}
      </div>
    </div>
  )
}

function Sparkle() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-9 sm:h-9 text-sun-300 shrink-0" fill="currentColor" aria-hidden>
      <path d="M16 0c.6 7.5 8.5 15.4 16 16-7.5.6-15.4 8.5-16 16-.6-7.5-8.5-15.4-16-16C7.5 15.4 15.4 7.5 16 0z" />
    </svg>
  )
}
