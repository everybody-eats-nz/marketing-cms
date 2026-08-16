'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMounted } from '@/lib/hooks'

/**
 * The cafe pages' booking modal — the same "stay on the page, load the widget
 * in place" flow as the main site's BookingDialog, but wearing the cafe's own
 * brand instead of Everybody Eats forest and cream.
 *
 * It is deliberately a separate component rather than a reuse of
 * src/components/booking/booking-dialog.tsx, for two reasons:
 *  - that dialog is built out of main-site tokens (forest, cream, sun, the
 *    display face), which is exactly the chrome these route groups exist to
 *    keep out;
 *  - each cafe books a single venue, so its first step — pick a restaurant —
 *    has nothing to choose between and is skipped entirely.
 *
 * Everything visual is namespaced to the brand and lives in that brand's
 * stylesheet, same rule as src/components/cafe-bar.tsx.
 */

export type CafeBrand = 'toast' | 'hopper'

const OPEN_EVENT = 'ee:cafe-booking:open'

/**
 * The widget renders on the cafe's own paper rather than stock white, so the
 * embed reads as part of the page. Only documented Now Book It params are
 * touched (theme / bg); the venue-configured `colors` value is left alone.
 * https://kb.nowbookit.com/knowledge/widget-modifications-and-iframes
 * Keep these matching --toast-paper / --hopper-lilac in the brand stylesheets.
 */
const WIDGET_PAPER: Record<CafeBrand, string> = {
  toast: 'FFF69B',
  hopper: 'E8CAFE',
}

function themedBookingUrl(raw: string, brand: CafeBrand): string {
  try {
    const url = new URL(raw)
    if (url.hostname !== 'nowbookit.com' && !url.hostname.endsWith('.nowbookit.com')) return raw
    url.searchParams.set('theme', 'light')
    url.searchParams.set('bg', WIDGET_PAPER[brand])
    return url.toString()
  } catch {
    return raw
  }
}

/** Returns whether a mounted dialog took the request. */
function openCafeBookingDialog(): boolean {
  const event = new CustomEvent(OPEN_EVENT, { cancelable: true })
  // The dialog calls preventDefault() to claim it, making dispatchEvent false.
  return !window.dispatchEvent(event)
}

/**
 * The Book button. Stays a real link to the booking site, so it still works
 * before hydration or with JS off; when the dialog is mounted and listening it
 * intercepts and opens in place instead.
 */
export function CafeBookingLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        if (openCafeBookingDialog()) e.preventDefault()
      }}
    >
      {children}
    </a>
  )
}

export function CafeBookingDialog({
  brand,
  bookingUrl,
  title = 'Book a table',
}: {
  brand: CafeBrand
  bookingUrl: string
  title?: string
}) {
  const mounted = useMounted()
  const [open, setOpen] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onOpen = (e: Event) => {
      e.preventDefault() // tells openCafeBookingDialog() we are handling it
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      setWidgetReady(false)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    // Deferred a frame: focusing an element while its `visibility` is still
    // flipping in the same frame silently no-ops in Chrome.
    const raf = requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
    }
  }, [open])

  // Once closed: hand focus back to the button that opened it and unload the
  // third-party widget so it isn't left running behind the page.
  useEffect(() => {
    if (open) return
    restoreFocusRef.current?.focus?.()
    const t = setTimeout(() => setWidgetReady(false), 400)
    return () => clearTimeout(t)
  }, [open])

  if (!mounted || !bookingUrl) return null

  const overlay = (
    <div
      className={`${brand}-scope ${brand}-modal ${open ? `${brand}-modal--open` : ''}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close booking"
        onClick={() => setOpen(false)}
        className={`${brand}-modal-backdrop`}
      />
      <div className={`${brand}-modal-panel`} role="dialog" aria-modal="true" aria-label={title}>
        <div className={`${brand}-modal-head`}>
          <p className={`${brand}-label`}>{title}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close booking"
            className={`${brand}-modal-close`}
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <div className={`${brand}-modal-frame`}>
          {open && (
            <iframe
              src={themedBookingUrl(bookingUrl, brand)}
              title={title}
              onLoad={() => setWidgetReady(true)}
            />
          )}
          <div
            className={`${brand}-modal-loading ${widgetReady ? `${brand}-modal-loading--done` : ''}`}
            aria-hidden={widgetReady}
          >
            <span className={`${brand}-label`} role="status">
              Loading…
            </span>
          </div>
        </div>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${brand}-modal-newtab`}
        >
          Open bookings in a new tab
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
