import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || '/'

  // Must be a same-site absolute path. Reject protocol-relative targets like
  // `//evil.com` (and the `/\evil.com` variant browsers normalise to `//`),
  // which would otherwise turn this into an open redirect.
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return new Response('Invalid path', { status: 400 })
  }

  // Draft mode makes the page renderers read unpublished content with
  // `overrideAccess` (bypassing collection read access). That must only ever be
  // available to logged-in editors, so gate it behind a valid Payload admin
  // session before enabling draft mode. Live preview runs inside the admin, so
  // the `payload-token` cookie is sent on this same-origin request and
  // `payload.auth` resolves the user from it. Without this guard, any
  // unauthenticated visitor could hit /api/preview, receive a draft-mode cookie,
  // and read unpublished pages/locations/events/journal posts.
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
