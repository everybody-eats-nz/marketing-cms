'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Opens the page it's rendered on at the top, whatever the scroll position the
// previous page left behind.
//
// Needed on the 404 page: when a client-side link points at a missing page,
// Next keeps the old scroll offset (and, for a URL like `/old-page#enquiry`,
// tries to scroll to a `#enquiry` element that doesn't exist on the 404). The
// short 404 then clamps to max scroll and the visitor lands looking at the
// footer. A layout-phase scroll from Next runs before this effect, so this
// reset wins. `instant` overrides the global `scroll-behavior: smooth`.
//
// Keyed on the pathname so a second broken link (404 → 404, where React keeps
// this component mounted) resets too.
export function ScrollToTopOnMount() {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
