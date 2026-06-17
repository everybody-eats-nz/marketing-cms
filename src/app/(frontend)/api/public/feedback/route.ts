import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public, read-only feed of published diner feedback — the reverse of the rest
// of the CMS↔portal integration (here the volunteer portal fetches FROM the
// CMS). Only published (positive + consented) feedback is returned, so it's
// safe to serve cross-origin. Volunteers see what diners said about the shift
// they worked; the portal filters by location + date.
//
//   GET /api/public/feedback?location=<slug>&since=<ISO date>&limit=<n>
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  const since = searchParams.get('since')
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200)

  const where: Record<string, unknown> = { status: { equals: 'published' } }
  if (location) where.locationSlug = { equals: location }
  if (since) {
    const d = new Date(since)
    if (!Number.isNaN(d.getTime())) where.createdAt = { greater_than_equal: d.toISOString() }
  }

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'feedback',
      where: where as never,
      sort: '-createdAt',
      limit,
      depth: 0,
    })

    const items = docs.map((d: any) => ({
      id: d.id,
      message: d.message,
      name: d.name || null,
      rating: d.rating ?? null,
      locationSlug: d.locationSlug || null,
      locationName: d.locationName || null,
      createdAt: d.createdAt,
    }))

    return NextResponse.json({ feedback: items }, { headers: CORS })
  } catch {
    return NextResponse.json({ error: 'Could not load feedback.' }, { status: 502, headers: CORS })
  }
}
