import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || '/'

  if (!path.startsWith('/')) {
    return new Response('Invalid path', { status: 400 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
