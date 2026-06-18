import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getPayCopy } from '@/lib/pay-copy.server'
import { fillTemplate } from '@/lib/pay-copy'
import { renderRichText } from '@/components/blocks/render-text'
import { PaySection } from '../pay-section'
import { DonateForm } from '../donate-form'
import { SPECIAL_EVENTS } from '../shared'

type Params = { params: Promise<{ location: string }> }

async function resolveLocation(slug: string): Promise<{ slug: string; name: string } | null> {
  if (slug === SPECIAL_EVENTS.slug) return SPECIAL_EVENTS
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const loc = docs[0] as { slug: string; name: string } | undefined
  return loc ? { slug: loc.slug, name: loc.name } : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { location } = await params
  const loc = await resolveLocation(location)
  if (!loc) return { title: 'Not found' }
  const { payment } = await getPayCopy()
  return {
    title: fillTemplate(payment.metaTitle, { location: loc.name }),
    description: payment.metaDescription,
  }
}

export default async function PayAmountPage({ params }: Params) {
  const { location } = await params

  // The old Webflow site used this slug for its special-events pay page —
  // QR codes (and NFC tags) may still point at it.
  if (location === 'special-events-2') redirect(`/dine-with-us/pay/${SPECIAL_EVENTS.slug}`)

  const loc = await resolveLocation(location)
  if (!loc) notFound()

  const isSpecialEvent = loc.slug === SPECIAL_EVENTS.slug
  const copy = await getPayCopy()
  const { payment } = copy

  return (
    <PaySection>
      <div className="container-tight relative pt-16 sm:pt-24 pb-24 text-cream-50">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left — the ask */}
          <div className="lg:col-span-6">
            <p className="eyebrow text-sun-200/90 mb-6">
              {isSpecialEvent
                ? payment.eyebrowSpecial
                : fillTemplate(payment.eyebrowLocation, { location: loc.name })}
            </p>
            <h1 className="display text-5xl sm:text-6xl lg:text-7xl font-light leading-[0.95]">
              {renderRichText(payment.heading, undefined, 'text-sun-200')}
            </h1>
            <p className="mt-7 max-w-md text-lg text-cream-50/80 leading-relaxed">
              {renderRichText(payment.explanation, undefined, 'text-cream-50 not-italic')}
            </p>
            <Link
              href="/dine-with-us/pay"
              className="mt-8 inline-flex items-center gap-2 text-sm text-cream-50/60 hover:text-cream-50 transition-colors"
            >
              <span aria-hidden>←</span> {payment.changeRestaurant}
            </Link>
          </div>

          {/* Right — embedded, on-site Stripe payment */}
          <div className="lg:col-span-6">
            <div className="rounded-[2rem] bg-surface text-content p-7 sm:p-10 shadow-2xl">
              <DonateForm
                locationSlug={loc.slug}
                locationName={loc.name}
                presets={copy.amounts.presets}
                copy={copy.form}
              />
            </div>
          </div>
        </div>
      </div>
    </PaySection>
  )
}
