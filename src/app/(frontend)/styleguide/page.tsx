import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Style guide',
  description: 'Design system reference for the Everybody Eats marketing site.',
  robots: { index: false, follow: false },
}

const colorGroups: Array<{
  name: string
  note: string
  swatches: Array<{ token: string; hex: string; tw: string; text?: 'dark' | 'light' }>
}> = [
  {
    name: 'Cream',
    note: 'Paper backgrounds. cream-50 is the page default.',
    swatches: [
      { token: 'cream-50', hex: '#FDF8EF', tw: 'bg-cream-50', text: 'dark' },
      { token: 'cream-100', hex: '#FAF2E4', tw: 'bg-cream-100', text: 'dark' },
      { token: 'cream-200', hex: '#F5E9D2', tw: 'bg-cream-200', text: 'dark' },
      { token: 'cream-300', hex: '#EDDDB7', tw: 'bg-cream-300', text: 'dark' },
    ],
  },
  {
    name: 'Forest',
    note: 'Brand primary. forest-500 is the action colour, forest-700 is the dark panel.',
    swatches: [
      { token: 'forest-50', hex: '#EEF4EF', tw: 'bg-forest-50', text: 'dark' },
      { token: 'forest-100', hex: '#D4E3D6', tw: 'bg-forest-100', text: 'dark' },
      { token: 'forest-200', hex: '#9BBDA0', tw: 'bg-forest-200', text: 'dark' },
      { token: 'forest-300', hex: '#5A8B62', tw: 'bg-forest-300', text: 'light' },
      { token: 'forest-400', hex: '#2E6438', tw: 'bg-forest-400', text: 'light' },
      { token: 'forest-500', hex: '#1D5337', tw: 'bg-forest-500', text: 'light' },
      { token: 'forest-600', hex: '#163F2A', tw: 'bg-forest-600', text: 'light' },
      { token: 'forest-700', hex: '#0E2A1C', tw: 'bg-forest-700', text: 'light' },
      { token: 'forest-800', hex: '#091A11', tw: 'bg-forest-800', text: 'light' },
      { token: 'forest-900', hex: '#040A07', tw: 'bg-forest-900', text: 'light' },
    ],
  },
  {
    name: 'Sun',
    note: 'Accent only. sun-200 powers buttons, highlights and CTA panels.',
    swatches: [
      { token: 'sun-50', hex: '#FEFFE8', tw: 'bg-sun-50', text: 'dark' },
      { token: 'sun-100', hex: '#FBFCB8', tw: 'bg-sun-100', text: 'dark' },
      { token: 'sun-200', hex: '#F8FB69', tw: 'bg-sun-200', text: 'dark' },
      { token: 'sun-300', hex: '#EDF03F', tw: 'bg-sun-300', text: 'dark' },
      { token: 'sun-400', hex: '#D3D622', tw: 'bg-sun-400', text: 'dark' },
    ],
  },
  {
    name: 'Clay',
    note: 'Tertiary accent for warmth — sparingly.',
    swatches: [
      { token: 'clay-100', hex: '#F4D2BE', tw: 'bg-clay-100', text: 'dark' },
      { token: 'clay-200', hex: '#E8A988', tw: 'bg-clay-200', text: 'dark' },
      { token: 'clay-300', hex: '#D87F58', tw: 'bg-clay-300', text: 'light' },
    ],
  },
  {
    name: 'Ink',
    note: 'Reserved for max-contrast text. Most copy uses forest-700.',
    swatches: [{ token: 'ink', hex: '#1A1410', tw: 'bg-ink', text: 'light' }],
  },
]

const displaySizes: Array<{ label: string; cls: string; note: string }> = [
  { label: '8xl — hero (rarely)', cls: 'text-8xl', note: '7.5rem' },
  { label: '7xl — hero default', cls: 'text-7xl', note: '6rem' },
  { label: '6xl — section heading', cls: 'text-6xl', note: '4.75rem' },
  { label: '5xl — sub-hero', cls: 'text-5xl', note: '3.5rem' },
  { label: '4xl — card title', cls: 'text-4xl', note: '2.5rem' },
  { label: '3xl', cls: 'text-3xl', note: '1.875rem' },
  { label: '2xl', cls: 'text-2xl', note: '1.5rem' },
]

const bodySizes: Array<{ label: string; cls: string; note: string }> = [
  { label: 'xl — lead paragraph', cls: 'text-xl', note: '1.25rem' },
  { label: 'lg — subheading', cls: 'text-lg', note: '1.125rem' },
  { label: 'base — body', cls: 'text-base', note: '1rem' },
  { label: 'sm — meta', cls: 'text-sm', note: '0.875rem' },
  { label: 'xs — fine print', cls: 'text-xs', note: '0.75rem' },
]

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="container-wide py-20 sm:py-24 border-t border-forest-500/10">
      <div className="mb-12 max-w-3xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="display text-4xl sm:text-5xl font-light text-forest-700">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.72rem] text-forest-600 bg-forest-500/8 px-2 py-1 rounded">
      {children}
    </code>
  )
}

export default function StyleGuidePage() {
  const sections = [
    { id: 'colour', label: 'Colour' },
    { id: 'type', label: 'Typography' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'components', label: 'Components' },
    { id: 'sections', label: 'Section patterns' },
    { id: 'motion', label: 'Motion & texture' },
  ]

  return (
    <>
      {/* Header */}
      <section className="container-wide pt-16 sm:pt-24 pb-12">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-forest-500/50" />
          Internal — design system
        </p>
        <h1 className="display text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.95] text-forest-700">
          The <em>style</em> guide.
        </h1>
        <p className="mt-8 text-lg sm:text-xl max-w-2xl text-forest-600/85 leading-relaxed">
          A live reference for the Everybody Eats marketing site — the tokens, type, buttons and
          section patterns that make up the system. Use it when building new blocks or auditing
          existing ones.
        </p>
        <nav aria-label="Style guide sections" className="mt-10 flex flex-wrap gap-2">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="btn-ghost text-xs">
              {s.label}
            </a>
          ))}
        </nav>
      </section>

      {/* Colour */}
      <Section id="colour" eyebrow="01 / Foundation" title="Colour palette">
        <div className="space-y-12">
          {colorGroups.map((group) => (
            <div key={group.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
                <h3 className="display text-2xl text-forest-700">{group.name}</h3>
                <p className="text-sm text-forest-600/70 max-w-md">{group.note}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {group.swatches.map((sw) => (
                  <div
                    key={sw.token}
                    className={`${sw.tw} rounded-2xl p-5 h-32 flex flex-col justify-between border border-forest-500/10`}
                  >
                    <span
                      className={`font-mono text-[0.7rem] tracking-wider ${
                        sw.text === 'light' ? 'text-cream-50/80' : 'text-forest-700/70'
                      }`}
                    >
                      {sw.token}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        sw.text === 'light' ? 'text-cream-50' : 'text-forest-700'
                      }`}
                    >
                      {sw.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
          <h3 className="display text-2xl text-forest-700 mb-3">Roles, not just colours</h3>
          <ul className="text-base text-forest-600/85 space-y-2 leading-relaxed">
            <li>
              <Code>bg-cream-50</Code> — default page background. Always paired with{' '}
              <Code>text-forest-700</Code>.
            </li>
            <li>
              <Code>bg-forest-700</Code> — dark panels (stats, pillars, CTA). Text becomes{' '}
              <Code>text-cream-50</Code>.
            </li>
            <li>
              <Code>bg-sun-200</Code> — accent CTAs, panel backgrounds, the underline highlight
              behind hero keywords. Never use for primary buttons.
            </li>
            <li>
              <Code>forest-500/&lt;n&gt;</Code> — hairlines and 5–15% tints for borders & dividers.
            </li>
          </ul>
        </div>
      </Section>

      {/* Typography */}
      <Section id="type" eyebrow="02 / Foundation" title="Typography">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Display — Fraunces</h3>
            <p className="text-sm text-forest-600/70 mb-8 max-w-md">
              Self-hosted Fraunces variable font with all four axes (<Code>SOFT</Code>,{' '}
              <Code>WONK</Code>, <Code>opsz</Code>, <Code>wght</Code>). Apply <Code>display</Code> or{' '}
              <Code>font-display</Code>. Headings render the light editorial italic
              automatically when you wrap a word in <Code>&lt;em&gt;</Code>.
            </p>
            <div className="space-y-6">
              {displaySizes.map((s) => (
                <div key={s.cls} className="border-b border-forest-500/10 pb-5">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="eyebrow">{s.label}</span>
                    <Code>
                      {s.cls} · {s.note}
                    </Code>
                  </div>
                  <p className={`display font-light text-forest-700 ${s.cls}`}>
                    Everybody <em>eats</em>.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Body — Plus Jakarta Sans</h3>
            <p className="text-sm text-forest-600/70 mb-8 max-w-md">
              The default <Code>font-sans</Code>. Used for paragraphs, navigation, buttons, meta.
              Body text default is <Code>text-forest-700</Code> at 85% opacity for long-form copy.
            </p>
            <div className="space-y-6">
              {bodySizes.map((s) => (
                <div key={s.cls} className="border-b border-forest-500/10 pb-5">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="eyebrow">{s.label}</span>
                    <Code>
                      {s.cls} · {s.note}
                    </Code>
                  </div>
                  <p className={`text-forest-700/85 ${s.cls}`}>
                    Pay-as-you-feel, restaurant-quality meals from rescued ingredients.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-6">
              <div>
                <p className="eyebrow mb-3">Eyebrow / kicker</p>
                <p className="eyebrow">A small label that sits above headings</p>
                <p className="mt-2 text-xs text-forest-600/70">
                  Class: <Code>eyebrow</Code> — 0.65rem, uppercase, 0.18em tracking.
                </p>
              </div>
              <div>
                <p className="eyebrow mb-3">Soft-wonk italic</p>
                <h3 className="display text-3xl text-forest-700 font-light">
                  Wrap a word in <em>emphasis</em> for the editorial italic.
                </h3>
                <p className="mt-2 text-xs text-forest-600/70">
                  Works on h1–h4 and any element with class <Code>display</Code>. In CMS textareas,{' '}
                  <Code>*asterisks*</Code> are converted to <Code>&lt;em&gt;</Code> by the
                  renderer.
                </p>
              </div>
              <div>
                <p className="eyebrow mb-3">Mono — JetBrains Mono</p>
                <p className="font-mono text-sm text-forest-600">
                  // Used for kickers, stat labels, code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section id="buttons" eyebrow="03 / Components" title="Buttons & links">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-4">Primary</p>
            <button className="btn-primary">Donate now</button>
            <p className="mt-4 text-xs text-forest-600/70 leading-relaxed">
              <Code>btn-primary</Code> — forest fill, lifts on hover. The default action.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-4">Accent</p>
            <button className="btn-accent">Book a table</button>
            <p className="mt-4 text-xs text-forest-600/70 leading-relaxed">
              <Code>btn-accent</Code> — sun-yellow on light backgrounds. Marketing CTAs.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-4">Ghost</p>
            <button className="btn-ghost">Learn more</button>
            <p className="mt-4 text-xs text-forest-600/70 leading-relaxed">
              <Code>btn-ghost</Code> — outline only, fills on hover. Secondary actions.
            </p>
          </div>
          <div className="bg-forest-700 rounded-3xl p-8">
            <p className="eyebrow text-cream-50/70 mb-4">On dark</p>
            <button className="btn-accent">Donate now</button>
            <p className="mt-4 text-xs text-cream-50/70 leading-relaxed">
              On forest panels, prefer{' '}
              <code className="font-mono text-[0.72rem] text-sun-200 bg-cream-50/10 px-2 py-1 rounded">
                btn-accent
              </code>{' '}
              for primary, or invert ghost borders.
            </p>
          </div>
          <div className="bg-sun-200 rounded-3xl p-8">
            <p className="eyebrow mb-4">On sun</p>
            <button className="btn-primary">Donate now</button>
            <p className="mt-4 text-xs text-forest-700/70 leading-relaxed">
              On sun panels, forest primary keeps contrast strongest.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-4">Inline arrow link</p>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-sm font-medium text-forest-500 hover:gap-3 transition-all"
            >
              Read the story <span>→</span>
            </a>
            <p className="mt-4 text-xs text-forest-600/70 leading-relaxed">
              The pillar/card link convention. Arrow nudges right on hover via gap change.
            </p>
          </div>
        </div>
      </Section>

      {/* Components */}
      <Section id="components" eyebrow="04 / Components" title="Building blocks">
        <div className="space-y-12">
          {/* Card hover */}
          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Cards</h3>
            <p className="text-sm text-forest-600/70 mb-6 max-w-md">
              Rounded corners (<Code>rounded-3xl</Code> or <Code>rounded-[3rem]</Code>), cream
              fills, lift on hover via <Code>card-hover</Code>.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card-hover bg-cream-100 rounded-3xl p-8 border border-forest-500/10"
                >
                  <div className="font-mono text-xs mb-6 tracking-[0.2em] text-forest-500/70">
                    0{i}
                  </div>
                  <h4 className="display text-2xl font-light text-forest-700 mb-3">
                    Rescue food
                  </h4>
                  <p className="text-sm text-forest-700/80 leading-relaxed">
                    Hover to see the card lift. The pattern is used by pillars, journal cards and
                    locations.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sun underline */}
          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Sun underline highlight</h3>
            <p className="text-sm text-forest-600/70 mb-6 max-w-md">
              The signature hero highlight — a sun-200 pill sits behind a keyword. Used in{' '}
              <Code>hero-block.tsx</Code> via <Code>highlightWord</Code>.
            </p>
            <h2 className="display text-4xl sm:text-6xl font-light text-forest-700">
              Restaurant-quality meals,{' '}
              <span className="relative inline-block">
                pay
                <span
                  className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-sun-200 -z-10 rounded-full"
                  aria-hidden
                />
              </span>{' '}
              what you can.
            </h2>
          </div>

          {/* Eyebrow + rule */}
          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Eyebrow with rule</h3>
            <p className="text-sm text-forest-600/70 mb-6 max-w-md">
              An eyebrow paired with an 8px hairline. Often opens hero sections.
            </p>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-forest-500/50" />
              Section kicker
            </p>
          </div>

          {/* Sticker */}
          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Sun sticker</h3>
            <p className="text-sm text-forest-600/70 mb-6 max-w-md">
              The rotated yellow disc that overlaps hero imagery. Used in{' '}
              <Code>hero-block.tsx</Code>.
            </p>
            <div className="relative inline-block">
              <div className="w-48 h-60 rounded-[3rem] bg-forest-300" />
              <div
                className="absolute -top-6 -right-6 w-32 h-32 grid place-items-center rounded-full bg-sun-200 text-forest-700 rotate-12 shadow-xl"
                aria-hidden
              >
                <span className="display text-center text-sm leading-tight font-medium">
                  Pay what
                  <br />
                  <em>you can</em>
                </span>
              </div>
            </div>
          </div>

          {/* Form input */}
          <div>
            <h3 className="display text-2xl text-forest-700 mb-2">Form inputs</h3>
            <p className="text-sm text-forest-600/70 mb-6 max-w-md">
              Pill inputs on dark, soft outline on light. From the newsletter form block.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <form className="flex items-center gap-2 bg-cream-100 rounded-pill p-1.5 border border-forest-500/10">
                <input
                  type="email"
                  placeholder="you@everybodyeats.nz"
                  className="flex-1 bg-transparent px-5 py-2 text-sm placeholder:text-forest-600/40 text-forest-700 focus:outline-none"
                />
                <button type="button" className="btn-primary text-xs px-5 py-2">
                  Sign up
                </button>
              </form>
              <form className="flex items-center gap-2 bg-forest-600 rounded-pill p-1.5">
                <input
                  type="email"
                  placeholder="you@everybodyeats.nz"
                  className="flex-1 bg-transparent px-5 py-2 text-sm placeholder:text-cream-50/40 text-cream-50 focus:outline-none"
                />
                <button type="button" className="btn-accent text-xs px-5 py-2">
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* Section patterns */}
      <Section id="sections" eyebrow="05 / Layout" title="Section patterns">
        <p className="text-base text-forest-600/85 max-w-2xl mb-10 leading-relaxed">
          Almost every section uses one of three surfaces: the default cream page, a sun-yellow
          panel, or a forest-dark panel. Pick the surface by mood — informational stays cream,
          marketing CTAs go sun, statements/numbers go forest.
        </p>

        {/* Light */}
        <div className="rounded-3xl bg-cream-100 grain p-10 mb-6 border border-forest-500/10">
          <p className="eyebrow mb-3">Light section</p>
          <h3 className="display text-3xl sm:text-4xl text-forest-700 font-light max-w-2xl">
            Default surface — cream-50 page, cream-100 panel.
          </h3>
          <p className="mt-4 text-forest-700/80 max-w-xl">
            Used for stats, journal lists, locations, FAQs. Pair with the <Code>grain</Code>{' '}
            utility for paper texture.
          </p>
        </div>

        {/* Sun */}
        <div className="rounded-3xl bg-sun-200 grain p-10 mb-6">
          <p className="eyebrow mb-3">Sun panel</p>
          <h3 className="display text-3xl sm:text-4xl text-forest-700 font-light max-w-2xl">
            For marketing CTAs and joyful statements.
          </h3>
          <p className="mt-4 text-forest-700/80 max-w-xl">
            Always pair with forest text. Used by <Code>cta-strip-block</Code> in its sun variant.
          </p>
        </div>

        {/* Forest */}
        <div className="rounded-3xl bg-forest-700 grain p-10 text-cream-50 relative overflow-hidden">
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <p className="eyebrow text-cream-50/70 mb-3">Forest panel</p>
            <h3 className="display text-3xl sm:text-4xl font-light max-w-2xl">
              For statement headlines and big numbers.
            </h3>
            <p className="mt-4 text-cream-50/85 max-w-xl">
              Used by stats <em>(dark)</em>, pillars <em>(forest theme)</em>, and the forest CTA
              variant. Often layered with a blurred sun-200 glow.
            </p>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="bg-cream-100 rounded-2xl p-6 border border-forest-500/10">
            <p className="eyebrow mb-2">Container</p>
            <p className="text-sm text-forest-600/85">
              <Code>container-wide</Code> — 88rem max, used on most sections.
              <br />
              <Code>container-tight</Code> — 64rem max, long-form / article surfaces.
            </p>
          </div>
          <div className="bg-cream-100 rounded-2xl p-6 border border-forest-500/10">
            <p className="eyebrow mb-2">Rhythm</p>
            <p className="text-sm text-forest-600/85">
              Section vertical padding: <Code>py-20</Code> sm <Code>py-24</Code>, panels{' '}
              <Code>py-24</Code> sm <Code>py-32</Code>. Inside panels: <Code>p-10</Code> to{' '}
              <Code>p-16</Code>.
            </p>
          </div>
        </div>
      </Section>

      {/* Motion & texture */}
      <Section id="motion" eyebrow="06 / Detail" title="Motion & texture">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-3">Grain</p>
            <p className="text-sm text-forest-600/85 leading-relaxed">
              Apply <Code>grain</Code> for the paper texture overlay. Built from an inline SVG
              fractal noise, multiply-blended at 5%.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-3">Card lift</p>
            <p className="text-sm text-forest-600/85 leading-relaxed">
              <Code>card-hover</Code> — 300ms ease, -translate-y-1, shadow-xl.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-3">Button lift</p>
            <p className="text-sm text-forest-600/85 leading-relaxed">
              Built into <Code>btn-primary</Code> / <Code>btn-accent</Code>: -translate-y-0.5 on
              hover, shadow-lg.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-3">Marquee</p>
            <p className="text-sm text-forest-600/85 leading-relaxed">
              <Code>marquee-track</Code> — 35s linear loop. Pauses on hover. Used by the partners
              marquee.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-3">Fade up</p>
            <p className="text-sm text-forest-600/85 leading-relaxed">
              <Code>animate-fade-up</Code> — 0.8s entrance. Apply sparingly to feature reveals.
            </p>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 border border-forest-500/10">
            <p className="eyebrow mb-3">Easing</p>
            <p className="text-sm text-forest-600/85 leading-relaxed">
              <Code>ease-in-out-soft</Code> for everyday interactions. <Code>ease-expressive</Code>{' '}
              for delight moments.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-forest-700 grain rounded-3xl p-8 text-cream-50">
          <p className="eyebrow text-cream-50/70 mb-3">A11y</p>
          <p className="text-base text-cream-50/85 max-w-2xl leading-relaxed">
            All non-essential animation is suppressed under{' '}
            <code className="font-mono text-sm text-sun-200">prefers-reduced-motion</code>. Stick
            to that contract — never put information in motion alone.
          </p>
        </div>
      </Section>

      {/* Footer */}
      <section className="container-wide py-20 border-t border-forest-500/10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-sm text-forest-600/70 max-w-2xl">
            Looking for the full agent reference? See <Code>STYLEGUIDE.md</Code> at the repo root —
            it&apos;s the canonical guide for adding new blocks and pages.
          </p>
          <Link href="/" className="btn-ghost text-xs">
            Back to site
          </Link>
        </div>
      </section>
    </>
  )
}
