import type { CafeBrand } from '@/components/cafe-booking-dialog'
import { activeClosure, type ActiveClosure } from '@/lib/closures'

/**
 * Temporary closures for the standalone cafes. Unlike the restaurants, Toast
 * and Hopper have no Location of their own, so their closure lists live in
 * Site Settings → Closures (the `closureBanner` group). They're read in two
 * places: the cafe's own page (a notice above its header bar) and the main
 * site's yellow closure strip, alongside the restaurants.
 */
export const CAFES: Record<CafeBrand, { name: string; href: string; closuresField: string }> = {
  toast: { name: 'Toast', href: '/toast', closuresField: 'toastClosures' },
  hopper: { name: 'Hopper Cafe', href: '/hopper', closuresField: 'hopperClosures' },
}

export const CAFE_BRANDS = Object.keys(CAFES) as CafeBrand[]

/** The current (or nearest upcoming) closure for a cafe, from a Site Settings doc. */
export function cafeClosure(settings: unknown, brand: CafeBrand): ActiveClosure | null {
  return activeClosure((settings as any)?.closureBanner?.[CAFES[brand].closuresField])
}
