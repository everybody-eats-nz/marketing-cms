import { PayloadImage } from '@/components/payload-image'
import { renderRichText } from './render-text'

type Partner = {
  id: string
  name: string
  tier: 'major' | 'supporting' | 'friend'
  friendCategory?: 'food-hospitality' | 'community' | 'business' | null
  logo?: any
  url?: string
  description?: string
}

type Props = {
  block: {
    eyebrow?: string
    heading?: string
    intro?: string
    viewAllLabel?: string
    viewAllHref?: string
  }
  partners: Partner[]
}

const FRIEND_GROUPS: Array<{ value: string; label: string }> = [
  { value: 'food-hospitality', label: 'Food & Hospitality' },
  { value: 'community', label: 'Community' },
  { value: 'business', label: 'Business' },
]

export function PartnersGridBlock({ block, partners }: Props) {
  if (!partners.length) return null

  const major = partners.filter((p) => p.tier === 'major')
  const supporting = partners.filter((p) => p.tier === 'supporting')
  const friends = partners.filter((p) => p.tier === 'friend')

  return (
    <section className="bg-white text-forest-700">
      <div className="container-wide py-20 sm:py-28">
        {/* Header */}
        <div className="max-w-3xl">
          {block.eyebrow && (
            <p className="eyebrow flex items-center gap-3 mb-5">
              <span className="inline-block w-8 h-px bg-forest-500/50" />
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="display text-4xl sm:text-6xl font-light leading-[1.05]">
              {renderRichText(block.heading)}
            </h2>
          )}
          {block.intro && (
            <p className="mt-6 text-lg sm:text-xl text-forest-700/80 leading-relaxed max-w-2xl">
              {renderRichText(block.intro)}
            </p>
          )}
        </div>

        {/* Major partners */}
        {major.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <TierLabel>Major partners</TierLabel>
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              {major.map((p) => (
                <MajorCard key={p.id} partner={p} />
              ))}
            </div>
          </div>
        )}

        {/* Supporting partners */}
        {supporting.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <TierLabel>Supporting partners</TierLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {supporting.map((p) => (
                <SupportingCard key={p.id} partner={p} />
              ))}
            </div>
          </div>
        )}

        {/* Friends of Everybody Eats */}
        {friends.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <TierLabel>Friends of Everybody Eats</TierLabel>
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {FRIEND_GROUPS.map((group) => {
                const members = friends.filter((p) => p.friendCategory === group.value)
                if (!members.length) return null
                return (
                  <div key={group.value}>
                    <h4 className="display text-xl font-normal mb-4 pb-4 border-b border-forest-500/15">
                      {group.label}
                    </h4>
                    <ul className="space-y-2.5">
                      {members.map((p) => (
                        <li key={p.id}>
                          <FriendName partner={p} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="eyebrow text-forest-500/80 mb-8 flex items-center gap-4">
      {children}
      <span className="flex-1 h-px bg-forest-500/10" />
    </h3>
  )
}

function MajorCard({ partner }: { partner: Partner }) {
  const hasDescription = Boolean(partner.description)
  const inner = (
    <div className="group relative flex h-full flex-col">
      {/* Logo tile */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-forest-500/10 bg-white transition-colors duration-300 group-hover:border-forest-500/25">
        <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-14 transition-transform duration-500 ease-in-out-soft group-hover:-translate-y-2">
          {partner.logo ? (
            <div className="relative h-full w-full">
              <PayloadImage
                media={partner.logo}
                size="card"
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-contain"
              />
            </div>
          ) : (
            <span className="display text-2xl sm:text-3xl font-light text-forest-700">
              {partner.name}
            </span>
          )}
        </div>

        {/* Desktop hover / focus info box */}
        {hasDescription && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-forest-700 p-6 text-cream-50 transition-transform duration-500 ease-in-out-soft group-hover:translate-y-0 group-focus-within:translate-y-0 lg:block">
            <p className="display text-lg font-normal">{partner.name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-cream-50/80">{partner.description}</p>
            {partner.url && (
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-sun-200">
                Visit site <span aria-hidden>→</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Caption — name always; description as fallback below the fold of hover on small screens */}
      <div className="mt-4">
        <p className="display text-lg font-normal">{partner.name}</p>
        {hasDescription && (
          <p className="mt-1 text-sm leading-relaxed text-forest-700/70 lg:hidden">
            {partner.description}
          </p>
        )}
      </div>
    </div>
  )

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer"
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40 focus-visible:ring-offset-2"
        title={partner.name}
      >
        {inner}
      </a>
    )
  }
  return inner
}

function SupportingCard({ partner }: { partner: Partner }) {
  const inner = (
    <div className="group flex aspect-[3/2] items-center justify-center rounded-xl border border-forest-500/10 bg-white p-6 transition-all duration-300 hover:border-forest-500/25 hover:shadow-[0_8px_30px_-12px_rgba(20,50,40,0.15)]">
      {partner.logo ? (
        <div className="relative h-full w-full opacity-75 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0">
          <PayloadImage
            media={partner.logo}
            size="card"
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="display text-center text-base font-light leading-tight text-forest-700/80">
          {partner.name}
        </span>
      )}
    </div>
  )

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer"
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40 focus-visible:ring-offset-2"
        title={partner.name}
      >
        {inner}
      </a>
    )
  }
  return inner
}

function FriendName({ partner }: { partner: Partner }) {
  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-baseline gap-1.5 text-forest-700 transition-colors hover:text-forest-500"
      >
        <span className="underline decoration-forest-500/25 decoration-1 underline-offset-4 transition-colors group-hover:decoration-forest-500">
          {partner.name}
        </span>
        <span
          aria-hidden
          className="translate-y-px text-xs text-forest-500/0 transition-all group-hover:text-forest-500"
        >
          ↗
        </span>
      </a>
    )
  }
  return <span className="text-forest-700/80">{partner.name}</span>
}
