import { RichText } from '@/components/rich-text'

type Props = {
  block: {
    content?: any
    width?: 'tight' | 'wide'
  }
}

export function RichTextBlock({ block }: Props) {
  if (!block.content) return null
  const container = block.width === 'wide' ? 'container-wide' : 'container-tight'
  return (
    <section className={`${container} py-16 sm:py-20`}>
      <RichText content={block.content} />
    </section>
  )
}
