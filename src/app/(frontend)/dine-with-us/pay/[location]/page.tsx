import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { PaySection } from '../pay-section'
import { PRESET_AMOUNTS, SPECIAL_EVENTS, STRIPE_PAYMENT_LINKS } from '../shared'

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
  return {
    title: `Pay what you feel — ${loc.name}`,
    description: 'Choose what to pay for tonight’s meal. Every dollar keeps the kitchen open.',
  }
}

export default async function PayAmountPage({ params }: Params) {
  const { location } = await params

  // The old Webflow site used this slug for its special-events pay page —
  // QR codes may still point at it.
  if (location === 'special-events-2') redirect(`/dine-with-us/pay/${SPECIAL_EVENTS.slug}`)

  const loc = await resolveLocation(location)
  if (!loc) notFound()

  const isSpecialEvent = loc.slug === SPECIAL_EVENTS.slug
  const links = STRIPE_PAYMENT_LINKS[loc.slug]

  return (
    <PaySection>
      <div className="container-tight relative pt-16 sm:pt-24 pb-24 text-cream-50">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left — the ask */}
          <div className="lg:col-span-6">
            <p className="eyebrow text-sun-200/90 mb-6">
              {isSpecialEvent ? 'Everybody Eats · Special event' : `Everybody Eats ${loc.name}`}
            </p>
            <h1 className="display text-5xl sm:text-6xl lg:text-7xl font-light leading-[0.95]">
              Pay what feels <em className="text-sun-200">right</em>
            </h1>
            <p className="mt-7 max-w-md text-lg text-cream-50/80 leading-relaxed">
              Whatever you can give tonight makes a difference. A three-course meal like yours
              typically costs <span className="text-cream-50">$25–$35</span> to put on the table —
              anything beyond that shouts dinner for someone who can’t.
            </p>
            <Link
              href="/dine-with-us/pay"
              className="mt-8 inline-flex items-center gap-2 text-sm text-cream-50/60 hover:text-cream-50 transition-colors"
            >
              <span aria-hidden>←</span> Not where you dined? Change restaurant
            </Link>
          </div>

          {/* Right — amounts, each a direct Stripe Payment Link */}
          <div className="lg:col-span-6">
            <div className="rounded-[2rem] bg-surface text-content p-7 sm:p-10 shadow-2xl">
              {links ? (
                <>
                  <p className="eyebrow mb-4">Tonight, I’d like to give</p>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_AMOUNTS.map((preset) => {
                      const href = links.amounts[preset.amount]
                      if (!href) return null
                      return (
                        <a
                          key={preset.amount}
                          href={href}
                          className="group rounded-2xl border border-line/25 px-4 py-5 text-center transition-all duration-200 hover:border-forest-500 hover:bg-forest-500 hover:text-cream-50 hover:shadow-lg active:scale-[0.98]"
                        >
                          <span className="display block text-3xl font-medium leading-tight">
                            ${preset.amount}
                          </span>
                          <span className="mt-1 block text-xs leading-snug text-muted group-hover:text-cream-50/75 transition-colors">
                            {preset.label}
                          </span>
                        </a>
                      )
                    })}
                  </div>

                  <a
                    href={links.other}
                    className="btn-primary w-full justify-center mt-5 py-4 text-base"
                  >
                    Choose another amount →
                  </a>

                  <p className="mt-5 text-xs text-muted/85 text-center leading-relaxed">
                    Secure payment by Stripe — card, Apple Pay or Google Pay.
                    <span className="block mt-1">
                      No amount is too small. Koha of any size is welcome.
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-center text-base text-muted py-6">
                  Online payments aren’t set up for {loc.name} yet — please see one of our team at
                  the counter. Sorry!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PaySection>
  )
}
