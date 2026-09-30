import type { Instrumentation } from 'next'

// Server-side error reporting. The browser SDK (src/instrumentation-client.ts)
// only sees the client side of a failed server render: in production React
// replaces the real message with "Minified React error #441" and there is no
// route, so the failing server path is invisible in PostHog. Next calls
// `onRequestError` with the original error and the route that threw, so we
// capture it here as a `$exception` event.
//
// Same approach as `captureAnalytics` in src/app/(frontend)/actions/enquiry.ts:
// a plain POST to the capture endpoint, no SDK, and a no-op until PostHog is
// configured.
//
// Only safe context leaves the server: the query string is dropped from the
// path, and each message keeps only its first line, capped in length (a Drizzle
// "Failed query" error puts the bound parameters on the lines after the SQL).

const MAX_MESSAGE_LENGTH = 500

function firstLine(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined
  return value.split('\n', 1)[0].slice(0, MAX_MESSAGE_LENGTH)
}

// posthog-js keeps the visitor's distinct_id and session id in the
// `ph_<key>_posthog` cookie. Reading it links the server error to the same
// person and session replay as the client-side #441.
function visitorFromCookie(cookieHeader: string | string[] | undefined, apiKey: string) {
  const header = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader
  const prefix = `ph_${apiKey}_posthog=`
  const raw = header
    ?.split(/;\s*/)
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length)
  if (!raw) return {}
  try {
    const data = JSON.parse(decodeURIComponent(raw))
    const sessionId = Array.isArray(data?.$sesid) ? data.$sesid[1] : undefined
    return {
      distinctId: typeof data?.distinct_id === 'string' ? data.distinct_id : undefined,
      sessionId: typeof sessionId === 'string' ? sessionId : undefined,
    }
  } catch {
    return {}
  }
}

// A visitor who leaves mid-stream makes React throw "The destination stream
// closed early.", which Next 16.3 passes here as a render error. The visitor
// saw no failure, so it is not reported. Next fixes this upstream in
// vercel/next.js#96715 (in 16.4 canary): remove this check after that upgrade.
function isClientDisconnect(err: { name?: unknown; message?: unknown } | undefined) {
  return (
    err?.message === 'The destination stream closed early.' ||
    err?.name === 'AbortError' ||
    err?.name === 'ResponseAborted'
  )
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_KEY
  if (!apiKey) return
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '')

  const err = (typeof error === 'object' && error ? error : {}) as {
    name?: unknown
    message?: unknown
    digest?: unknown
    cause?: { name?: unknown; message?: unknown }
  }
  if (isClientDisconnect(err) || isClientDisconnect(err.cause)) return
  const { distinctId, sessionId } = visitorFromCookie(request.headers.cookie, apiKey)

  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        event: '$exception',
        distinct_id: distinctId ?? crypto.randomUUID(),
        properties: {
          $exception_list: [
            {
              type: typeof err.name === 'string' ? err.name : 'Error',
              value: firstLine(typeof err.message === 'string' ? err.message : String(error)),
              mechanism: { handled: false, synthetic: false, type: 'onRequestError' },
            },
          ],
          $exception_level: 'error',
          $session_id: sessionId,
          $process_person_profile: distinctId ? undefined : false,
          $pathname: request.path.split('?', 1)[0],
          request_method: request.method,
          route_path: context.routePath,
          route_type: context.routeType,
          render_source: context.renderSource,
          router_kind: context.routerKind,
          error_digest: typeof err.digest === 'string' ? err.digest : undefined,
          error_cause: firstLine(err.cause?.message),
        },
      }),
    })
  } catch {
    // Error reporting must never throw from inside Next's error path.
  }
}
