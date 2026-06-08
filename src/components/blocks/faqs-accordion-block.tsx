import { RichText } from '@/components/rich-text'

type Props = {
  faqs: any[]
}

const CATEGORY_LABEL: Record<string, string> = {
  'pay-as-you-feel': 'Paying at the restaurant',
  'about-us': 'About Everybody Eats',
  dining: 'Dining experience',
  volunteering: 'Volunteering',
  donating: 'Partnering & donations',
  'our-meals': 'About our meals',
  events: 'Events',
}

// Render groups in this order regardless of per-item displayOrder.
const CATEGORY_ORDER = [
  'pay-as-you-feel',
  'about-us',
  'dining',
  'volunteering',
  'donating',
  'our-meals',
  'events',
]

export function FaqsAccordionBlock({ faqs }: Props) {
  if (!faqs.length) return null

  const groups = new Map<string, any[]>()
  for (const f of faqs) {
    const key = f.category || 'about-us'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(f)
  }

  const orderedGroups = [...groups.entries()].sort(
    ([a], [b]) =>
      (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99),
  )

  return (
    <section className="container-tight pb-32">
      {orderedGroups.map(([cat, items]) => (
        <div key={cat} className="mb-12">
          <h2 className="display text-2xl sm:text-3xl text-forest-700 font-medium mb-6">
            {CATEGORY_LABEL[cat] || cat}
          </h2>
          <div className="border-t border-forest-500/15">
            {items.map((faq) => (
              <details key={faq.id} className="group border-b border-forest-500/15 py-6">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                  <span className="display text-lg sm:text-xl font-medium text-forest-700 group-hover:text-forest-500 transition-colors leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 w-8 h-8 grid place-items-center rounded-full border border-forest-500/30 text-forest-500 transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 pl-0 sm:pl-1 text-forest-600/85 leading-relaxed">
                  <RichText content={faq.answer} />
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
