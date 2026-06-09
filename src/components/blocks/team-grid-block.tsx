import { PayloadImage } from '@/components/payload-image'

type Props = {
  team: any[]
}

const STAFF_LABELS: Record<string, string> = {
  board: 'Board',
  leadership: 'Leadership',
  kitchen: 'Kitchen',
  foh: 'Front of house',
  operations: 'Operations',
  volunteer: 'Volunteers',
}

const ORDERED_KEYS = ['leadership', 'board', 'kitchen', 'foh', 'operations', 'volunteer']

export function TeamGridBlock({ team }: Props) {
  if (!team.length) return null
  const groups = new Map<string, any[]>()
  for (const m of team) {
    const key = m.staffType || 'leadership'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(m)
  }

  return (
    <>
      {ORDERED_KEYS.map((key) => {
        const members = groups.get(key) || []
        if (!members.length) return null
        return (
          <section key={key} className="container-wide pb-24">
            <h2 className="display text-3xl sm:text-4xl font-light text-content mb-10 flex items-baseline gap-4">
              {STAFF_LABELS[key] || key}
              <span className="font-mono text-sm text-muted/70 normal-case tracking-normal">
                · {String(members.length).padStart(2, '0')}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {members.map((m) => (
                <article key={m.id} className="group">
                  <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-surface-3 mb-5">
                    {m.profilePicture ? (
                      <PayloadImage
                        media={m.profilePicture}
                        size="feature"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-forest-300 to-forest-500" />
                    )}
                  </div>
                  <h3 className="display text-xl text-content font-medium">{m.name}</h3>
                  {m.jobTitle && <p className="text-sm text-muted/85 mt-1">{m.jobTitle}</p>}
                  {m.bioSummary && (
                    <p className="mt-4 text-sm text-content/75 leading-relaxed line-clamp-4">
                      {m.bioSummary}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
