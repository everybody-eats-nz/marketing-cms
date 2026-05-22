import { PayloadImage } from '@/components/payload-image'

type Props = {
  block: {
    image?: any
    aspect?: '16:8' | '16:9' | '4:3' | '1:1' | 'auto'
  }
}

const ASPECT_CLASS: Record<string, string> = {
  '16:8': 'aspect-[16/8]',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  auto: '',
}

export function MediaBlockRenderer({ block }: Props) {
  if (!block.image) return null
  const aspect = ASPECT_CLASS[block.aspect || '16:8']
  return (
    <section className="container-wide pb-20">
      <div className={`relative ${aspect} rounded-[3rem] overflow-hidden bg-forest-100`}>
        <PayloadImage
          media={block.image}
          size="hero"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}
