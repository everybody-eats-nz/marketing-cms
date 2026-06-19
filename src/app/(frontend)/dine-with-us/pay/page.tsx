import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { getPayCopy } from '@/lib/pay-copy.server'
import { renderRichText } from '@/components/blocks/render-text'
import { PaySection } from './pay-section'
import { SPECIAL_EVENTS } from './shared'

export async function generateMetadata(): Promise<Metadata> {
  const { picker } = await getPayCopy()
  return {
    title: picker.metaTitle,
    description: picker.metaDescription,
    alternates: { canonical: '/dine-with-us/pay' },
  }
}

export default async function PayLocationPickerPage() {
  const payload = await getPayloadClient()
  const [{ docs: locations }, copy] = await Promise.all([
    payload.find({
      collection: 'locations',
      where: { openStatus: { equals: 'open' } },
      sort: 'name',
      limit: 20,
      depth: 0,
    }),
    getPayCopy(),
  ])
  const { picker } = copy

  return (
    <PaySection>
      <div className="container-tight relative pt-20 sm:pt-28 pb-24 text-cream-50">
        <p className="eyebrow text-sun-200/90 mb-6">{picker.eyebrow}</p>
        <h1 className="display text-5xl sm:text-7xl font-light leading-[0.95] max-w-2xl">
          {renderRichText(picker.heading, undefined, 'text-sun-200')}
        </h1>
        <p className="mt-6 max-w-md text-lg text-cream-50/80 leading-relaxed">
          {picker.subheading}
        </p>

        <div className="mt-12 max-w-2xl space-y-3">
          {locations.map((loc: any) => (
            <Link
              key={loc.id}
              href={`/dine-with-us/pay/${loc.slug}`}
              className="group flex items-baseline justify-between gap-4 rounded-[1.75rem] border border-cream-50/15 bg-cream-50/[0.04] px-7 py-6 sm:px-9 sm:py-7 transition-all duration-200 hover:bg-cream-50 hover:text-forest-700 hover:border-cream-50 active:scale-[0.99]"
            >
              <span className="flex items-baseline gap-4 min-w-0">
                <span className="display text-3xl sm:text-4xl font-light leading-tight truncate pb-[0.15em] -mb-[0.15em]">
                  {loc.name}
                </span>
                {loc.city && loc.city !== loc.name && (
                  <span className="hidden sm:inline text-sm text-cream-50/60 group-hover:text-forest-700/60 transition-colors shrink-0">
                    {loc.city}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className="display text-2xl text-sun-200 group-hover:text-forest-700 group-hover:translate-x-1 transition-all shrink-0"
              >
                →
              </span>
            </Link>
          ))}

          <Link
            href={`/dine-with-us/pay/${SPECIAL_EVENTS.slug}`}
            className="group flex items-baseline justify-between gap-4 rounded-[1.75rem] border border-dashed border-cream-50/20 px-7 py-5 sm:px-9 transition-all duration-200 hover:bg-cream-50/[0.07] active:scale-[0.99]"
          >
            <span className="text-base text-cream-50/75 group-hover:text-cream-50 transition-colors">
              {picker.specialEventsLabel}
            </span>
            <span
              aria-hidden
              className="text-cream-50/50 group-hover:text-sun-200 group-hover:translate-x-1 transition-all shrink-0"
            >
              →
            </span>
          </Link>
        </div>

        <p className="mt-10 flex items-center gap-2 text-xs text-cream-50/55">
          <LockIcon />
          {picker.securityNote}
        </p>
      </div>
    </PaySection>
  )
}

function LockIcon() {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
