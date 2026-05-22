import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || '/'
  ;(await draftMode()).disable()
  redirect(path.startsWith('/') ? path : '/')
}
