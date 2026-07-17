import posthog from 'posthog-js'
import type { CaptureResult } from 'posthog-js'

// Substrings that mark a captured exception as third-party browser-extension
// noise rather than a real site error. `capture_exceptions` turns on global
// `unhandledrejection` autocapture, which scoops up promise rejections thrown by
// extension content scripts running in the page. The one we see is
// "Non-Error promise rejection captured with value: Object Not Found Matching
// Id:… MethodName:update ParamCount:…" — an injected script that can't reach its
// own background page. Neither string appears anywhere in our code, so matching
// on them only ever drops extension noise, never a genuine site error.
const EXTENSION_NOISE_MARKERS = [
  'Object Not Found Matching Id',
  'MethodName:update',
]

// Drop $exception events whose message matches a known extension-noise marker.
// Returning null tells posthog-js not to send the event.
function dropExtensionNoise(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== '$exception') return event

  const exceptions = event.properties?.$exception_list
  if (!Array.isArray(exceptions)) return event

  const isNoise = exceptions.some((ex: { value?: unknown }) => {
    const value = typeof ex?.value === 'string' ? ex.value : ''
    return EXTENSION_NOISE_MARKERS.some((marker) => value.includes(marker))
  })

  return isNoise ? null : event
}

// Client-side PostHog bootstrap. Next.js runs `instrumentation-client` once per
// full page load, before the app hydrates — the canonical place to init the
// browser SDK in Next 15.3+/16 (do NOT also wrap the tree in a PostHogProvider).
//
// Two deliberate guards:
//  1. No key → no-op. Keeps local dev and the pre-launch preview quiet until the
//     project token is set, mirroring the server-side capture in
//     src/app/(frontend)/actions/enquiry.ts.
//  2. Skip the Payload CMS admin. /admin shares this Next.js process; we only
//     want analytics + session replay on the public marketing site, not on staff
//     CMS sessions. instrumentation-client fires on the initial full-page load,
//     and /admin is always a separate document from the (frontend) routes, so a
//     pathname check here cleanly excludes it.
//
// Ingestion is proxied through /ingest (see next.config.mjs rewrites) so it
// rides the first-party domain and survives ad blockers. `defaults` opts into
// PostHog's current best-practice bundle (autocapture + history-aware pageviews
// and pageleaves), so no manual $pageview wiring is needed for App Router nav.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key && typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
  posthog.init(key, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    before_send: dropExtensionNoise,
    debug: process.env.NODE_ENV === 'development',
  })
}
