import { getPayloadClient } from '@/lib/payload'
import type { CafeBrand } from '@/components/cafe-booking-dialog'

/**
 * The data behind the cafe pages' header bar (src/components/cafe-bar.tsx).
 *
 * Each cafe books through the Everybody Eats restaurant whose kitchen it runs
 * out of, so the Book button reads that location's `bookingUrl` rather than a
 * copy pasted into Site Settings — the two can then never drift apart. Site
 * Settings → Cafe banner stays available as a per-cafe override, for when a
 * cafe gets a booking system of its own.
 */
const HOST_LOCATION_SLUG: Record<CafeBrand, string> = {
  toast: 'onehunga',
  hopper: 'wellington',
}

const OVERRIDE_FIELD: Record<CafeBrand, string> = {
  toast: 'toastBookingUrl',
  hopper: 'hopperBookingUrl',
}

export type CafeBarData = {
  /** False when Site Settings can't be read, in which case no bar renders. */
  show: boolean
  bookUrl: string
  bookLabel?: string
  donateUrl: string
  donateLabel?: string
}

export async function loadCafeBarData(brand: CafeBrand): Promise<CafeBarData> {
  // A failed lookup must not take the page down: no settings means no bar, and
  // no reachable location just means Book drops out and Donate runs alone.
  const payload = await getPayloadClient().catch(() => null)
  const [settings, hostLocation] = await Promise.all([
    payload?.findGlobal({ slug: 'site-settings' }).catch(() => null) ?? null,
    payload
      ?.find({
        collection: 'locations',
        where: { slug: { equals: HOST_LOCATION_SLUG[brand] } },
        limit: 1,
        depth: 0,
      })
      .then((res) => res.docs[0] || null)
      .catch(() => null) ?? null,
  ])

  const cafeBanner = (settings as any)?.cafeBanner || {}
  return {
    show: Boolean(settings),
    bookUrl: cafeBanner[OVERRIDE_FIELD[brand]] || (hostLocation as any)?.bookingUrl || '',
    bookLabel: cafeBanner.bookLabel,
    donateUrl: cafeBanner.donateUrl || (settings as any)?.donateUrl || '/get-involved/donate',
    donateLabel: cafeBanner.donateLabel,
  }
}
