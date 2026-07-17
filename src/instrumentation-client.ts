import posthog from 'posthog-js'
import type { CaptureResult } from 'posthog-js'

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

// Drop a specific class of third-party noise from exception autocapture. A
// browser extension / injected script on the marketing site occasionally calls
// JSON.stringify on a live DOM node whose React fiber closes a reference cycle,
// throwing `TypeError: Converting circular structure to JSON`. That bubbles to
// `window.onerror`, which `capture_exceptions` hooks, so it lands in error
// tracking as a synthetic, stack-traceless issue. None of our own code can
// produce it (every JSON.stringify here serializes a plain object, never a DOM
// node), so we filter it out before it's sent rather than have it clutter the
// issue list. Returning null discards the event.
function dropCircularJsonNoise(event: CaptureResult | null): CaptureResult | null {
  if (event?.event !== '$exception') return event

  const exceptions = event.properties?.$exception_list
  if (
    Array.isArray(exceptions) &&
    exceptions.some((ex) =>
      typeof ex?.value === 'string' && ex.value.includes('Converting circular structure to JSON'),
    )
  ) {
    return null
  }

  return event
}

if (key && typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
  posthog.init(key, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
    before_send: dropCircularJsonNoise,
  })
}
