import Image from 'next/image'
import { PayloadImage } from '@/components/payload-image'
import type { Media } from '@/lib/types'

type Props = {
  /** An uploaded Payload media object (or its id/null when unset). */
  media: Media | string | number | null | undefined
  /** Static path baked into the design, used whenever no media is uploaded. */
  fallback: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  size?: 'thumbnail' | 'card' | 'feature' | 'hero'
}

/**
 * A `fill` image that prefers an editor-uploaded media object but gracefully
 * falls back to a hardcoded asset path — so bespoke pages migrated into the CMS
 * render identically out of the box, yet each image can be swapped per event.
 */
export function FillImage({ media, fallback, alt, sizes, className, priority, size }: Props) {
  if (media && typeof media === 'object') {
    return (
      <PayloadImage
        media={media}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        size={size}
      />
    )
  }
  return (
    <Image
      src={fallback}
      alt={alt}
      fill
      sizes={sizes || '100vw'}
      className={className}
      priority={priority}
    />
  )
}
