import Image from 'next/image'
import type { Media } from '@/lib/types'

type Props = {
  media: Media | string | number | null | undefined
  alt?: string
  className?: string
  sizes?: string
  size?: 'thumbnail' | 'card' | 'feature' | 'hero'
  priority?: boolean
  fill?: boolean
}

export function PayloadImage({
  media,
  alt,
  className,
  sizes,
  size = 'feature',
  priority,
  fill,
}: Props) {
  if (!media || typeof media !== 'object') return null
  const resolvedUrl =
    media.sizes?.[size]?.url || media.sizes?.feature?.url || media.url
  if (!resolvedUrl) return null

  const url = resolvedUrl.startsWith('/api/')
    ? resolvedUrl
    : resolvedUrl.startsWith('http')
    ? resolvedUrl
    : `${resolvedUrl}`

  const width = media.sizes?.[size]?.width || media.width || 1400
  const height = media.sizes?.[size]?.height || media.height || 900

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt ?? media.alt ?? ''}
        fill
        sizes={sizes || '100vw'}
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={alt ?? media.alt ?? ''}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  )
}
