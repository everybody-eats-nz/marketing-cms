import { RichText } from '@/components/rich-text'
import { JsonLd, buildFaqPage } from '@/components/structured-data'

type Props = {
  faqs: any[]
  block?: { title?: string | null; category?: string | null }
}

const CATEGORY_LABEL: Record<string, string> = {
  'pay-as-you-feel': 'Paying at the restaurant',
  'about-us': 'About Everybody Eats',
  dining: 'Dining experience',
  volunteering: 'Volunteering',
  donating: 'Partnering & donations',
  'our-meals': 'About our meals',
  events: 'Events',
  'volunteer-shifts': 'Volunteering on a shift',
}

// The general FAQ categories shown (grouped, in this order) when the block has
// no category filter — e.g. the /about/faqs page. Page-specific categories such
// as 'volunteer-shifts' are intentionally omitted so they only surface where a
// block explicitly filters to them (see the Volunteer page).
const CATEGORY_ORDER = [
  'pay-as-you-feel',
  'about-us',
  'dining',
  'volunteering',
  'donating',
  'our-meals',
  'events',
]

function AccordionItem({ faq }: { faq: any }) {
  return (
    <details className="group border-b border-line/15 py-6">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
        <span className="display text-lg sm:text-xl font-medium text-content group-hover:text-muted transition-colors leading-snug">
          {faq.question}
        </span>
        <span
          className="shrink-0 w-8 h-8 grid place-items-center rounded-full border border-line/30 text-muted transition-transform group-open:rotate-45"
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
      <div className="mt-4 pl-0 sm:pl-1 text-content/85 leading-relaxed">
        <RichText content={faq.answer} />
      </div>
    </details>
  )
}

export function FaqsAccordionBlock({ faqs, block }: Props) {
  if (!faqs.length) return null

  const title = block?.title || null
  const filterCategory = block?.category || null

  // Filtered mode: a single category rendered as one flat list (no per-category
  // headings) — used for page-specific sections like the Volunteer page. FAQs
  // arrive already sorted by displayOrder (see page-body.tsx).
  if (filterCategory) {
    const items = faqs.filter((f) => f.category === filterCategory)
    if (!items.length) return null
    const faqSchema = buildFaqPage(items)

    return (
      <section className="container-tight pb-32">
        {faqSchema && <JsonLd data={faqSchema} />}
        {title && (
          <h2 className="display text-2xl sm:text-3xl text-content font-medium mb-6">
            {title}
          </h2>
        )}
        <div className="border-t border-line/15">
          {items.map((faq) => (
            <AccordionItem key={faq.id} faq={faq} />
          ))}
        </div>
      </section>
    )
  }

  // Default mode: all general categories, grouped and ordered.
  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: faqs.filter((f) => (f.category || 'about-us') === cat),
  })).filter((g) => g.items.length)

  const faqSchema = buildFaqPage(groups.flatMap((g) => g.items))

  return (
    <section className="container-tight pb-32">
      {faqSchema && <JsonLd data={faqSchema} />}
      {title && (
        <h2 className="display text-2xl sm:text-3xl text-content font-medium mb-10">
          {title}
        </h2>
      )}
      {groups.map(({ cat, items }) => (
        <div key={cat} className="mb-12">
          <h2 className="display text-2xl sm:text-3xl text-content font-medium mb-6">
            {CATEGORY_LABEL[cat] || cat}
          </h2>
          <div className="border-t border-line/15">
            {items.map((faq) => (
              <AccordionItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
