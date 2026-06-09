import { Marquee } from '@/components/marquee'

type Props = {
  block: {
    items?: { text: string }[]
  }
}

export function MarqueeBlock({ block }: Props) {
  const items = (block.items || []).map((i) => i.text).filter(Boolean)
  if (!items.length) return null
  return (
    <section className="bg-forest-500 text-cream-50 py-5 border-y border-line grain">
      <Marquee items={items} className="text-cream-50" />
    </section>
  )
}
