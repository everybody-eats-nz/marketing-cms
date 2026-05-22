'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { RenderBlocks, type RenderExtras } from './render-blocks'

type Props = {
  initial: any
  serverURL: string
} & RenderExtras

export function PageLivePreview({ initial, serverURL, ...extras }: Props) {
  const { data } = useLivePreview<any>({
    initialData: initial,
    serverURL,
    depth: 2,
  })

  return (
    <RenderBlocks
      blocks={data?.layout || []}
      {...extras}
      fallbackHeroHeading={data?.title}
    />
  )
}
