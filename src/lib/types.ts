// Lightweight types for things we read from Payload before the codegen
// finishes (and that codegen will eventually replace via `pnpm generate:types`).

export type Media = {
  id: number | string
  url?: string | null
  alt?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  sizes?: Record<string, { url?: string; width?: number; height?: number }>
}

export type LinkValue = {
  label?: string
  type?: 'internal' | 'external'
  internalHref?: string
  externalHref?: string
  openInNewTab?: boolean
}

export function resolveHref(link: LinkValue | undefined | null): string {
  if (!link) return '#'
  return (link.type === 'external' ? link.externalHref : link.internalHref) || '#'
}

export function imageUrl(media: Media | string | number | null | undefined, size: 'thumbnail' | 'card' | 'feature' | 'hero' = 'card'): string | null {
  if (!media || typeof media !== 'object') return null
  return media.sizes?.[size]?.url || media.url || null
}
