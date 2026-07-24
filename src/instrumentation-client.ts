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

// React #418 is a text-content hydration mismatch: the text a server-rendered
// node contained differs from what the client renders on hydration. React
// silently recovers by throwing away the server markup for that subtree and
// re-rendering it on the client, so nothing visibly breaks. `capture_exceptions`
// still records the throw as an unhandled error.
//
// In production it fires across unrelated CMS content pages (faqs, team, contact,
// journal, …) and every browser, and — now that source maps are uploaded (see
// `withPostHogConfig` in next.config.mjs) — the symbolicated trace bottoms out in
// React's own `throwOnHydrationMismatch` with no application frame implicated.
// That signature (benign, page-agnostic, browser-agnostic, generic `args[]=text`
// message, no app frame) is the classic fingerprint of client-side text mutation
// before hydration — browser auto-translation (Chrome/Safari "Translate page")
// and extensions rewriting the DOM. It is not a defect in our markup, so it only
// pollutes error tracking. The minified message reliably carries the error code,
// which is what we match on.
const REACT_HYDRATION_MISMATCH_MARKER = 'Minified React error #418'

// Drop $exception events whose message matches known benign noise: third-party
// browser-extension rejections, and the React #418 text-content hydration
// mismatch caused by external DOM mutation (auto-translate/extensions).
// Returning null tells posthog-js not to send the event.
function dropExtensionNoise(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== '$exception') return event

  const exceptions = event.properties?.$exception_list
  if (!Array.isArray(exceptions)) return event

  const isNoise = exceptions.some((ex: { value?: unknown }) => {
    const value = typeof ex?.value === 'string' ? ex.value : ''
    return (
      EXTENSION_NOISE_MARKERS.some((marker) => value.includes(marker)) ||
      value.includes(REACT_HYDRATION_MISMATCH_MARKER)
    )
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
