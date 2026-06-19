import type { Metadata } from 'next'
import Image from 'next/image'
import { GalaCountdown } from './gala-countdown'

// Bespoke event landing page for the Everybody Eats fundraising Gala
// (Fri 30 Oct 2026, St Matthew-in-the-City). Built from the sponsorship deck.
// Unlike the rest of the site this page commits to an always-dark, theatrical
// drag-cabaret palette (forest + sun + cream literals) regardless of the site
// theme — it's a self-contained microsite for one glamorous night.

const GALA_EMAIL = 'gala@everybodyeats.nz'
const MAJOR_GIFTS_EMAIL = 'amy@everybodyeats.nz'

const mailto = (email: string, subject: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`

export const metadata: Metadata = {
  title: 'The Gala',
  description:
    'The Everybody Eats Gala — a high-class drag cabaret evening at St Matthew-in-the-City, Auckland, on Friday 30 October 2026. Host a table, sponsor the night, or donate to the auction. Every dollar keeps our restaurant doors open.',
  openGraph: {
    title: 'The Everybody Eats Gala — 30 October 2026',
    description:
      'A high-class drag cabaret evening at St Matthew-in-the-City, Auckland. Auckland trades the boardroom for the ballroom in support of dignity on every plate.',
    images: [{ url: '/images/gala/venue.jpg', width: 1310, height: 1747 }],
  },
}

// ── Content ──────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  'Live drag cabaret',
  'Canapés on arrival',
  'Free-flowing drinks',
  'Three incredible courses',
  'Live auctions',
  'Silent auctions',
]

const PROBLEM = [
  {
    figure: '1 in 5',
    body: 'children in New Zealand live in households where food runs out often, or sometimes.',
  },
  {
    figure: '1 in 3',
    body: 'households experience food insecurity — most in just the last 12 months, driven by the cost-of-living crisis.',
  },
  {
    figure: '49%',
    body: 'of food-insecure Kiwi families refuse to ask for charity, because of intense shame and embarrassment.',
  },
  {
    figure: '30%',
    body: 'of full-time Kiwi workers rely on food assistance or struggle to buy groceries for their families.',
  },
]

const IMPACT = [
  { value: '279,807+', label: 'Meals served' },
  { value: '139,904+', label: 'Kg of food rescued' },
  { value: '174,853+', label: 'Volunteer hours' },
]

const PERFORMERS = [
  {
    name: 'Hugo Grrrl',
    role: 'MC / Producer',
    image: '/images/gala/performer-hugo.jpg',
    bio: 'Aotearoa’s leading drag king: a celebrated performer, comedian and MC who blends sharp wit with dazzling theatricality. The first drag king and transgender man to win a televised drag competition, Hugo is a trailblazing force in New Zealand entertainment.',
  },
  {
    name: 'Slay West',
    role: 'Performer',
    image: '/images/gala/performer-slay.jpg',
    bio: 'One of Wellington’s most beloved drag entertainers, renowned for infectious energy, quick wit and the ability to light up any room. A proud member of the acclaimed Māori drag collective The Tīwhas, Slay brings warmth, charisma and joy that leave a lasting impression.',
  },
  {
    name: 'Altra Violet',
    role: 'Performer',
    image: '/images/gala/performer-altra.jpg',
    bio: 'Also known as Robin Yablind, Altra is an award-winning cabaret artist, choreographer and drag performer, and a beloved fixture of Wellington’s queer arts scene. Blending drag, burlesque, dance and theatre, this takatāpui artist brings exceptional creativity, stage presence and heart to every performance.',
  },
]

const CHEFS = [
  {
    name: 'Archana Kurup',
    location: 'Onehunga',
    image: '/images/gala/chef-archana.jpg',
    bio: 'Trained across cuisines and continents, Archana’s cooking is a celebration of food’s ability to nourish and unite. Her joy for feeding people shines in every delicious plate that supports the kaupapa of Everybody Eats.',
  },
  {
    name: 'Urisha Sing',
    location: 'Glen Innes',
    image: '/images/gala/chef-urisha.jpg',
    bio: 'Urisha cooks with compassion and adapts creatively, honouring both her cultural roots and the diverse communities she serves — making her a powerful advocate for tackling food insecurity and uniting people around the table.',
  },
  {
    name: 'Harri Fletcher',
    location: 'Wellington',
    image: '/images/gala/chef-harri.png',
    bio: 'Harri’s love of travel and global cuisines inspires bold, flavourful food. With a background in pay-as-you-can dining in the UK, she’s passionate about fighting food waste and making delicious food accessible to all.',
  },
]

const TIERS = [
  {
    eyebrow: 'Naming sponsor',
    badge: 'One only',
    title: 'The [Your Name] Everybody Eats Gala',
    price: '$25,000',
    includes: [
      'A reserved table of ten',
      'The Gala carries your name, everywhere',
      'Sole spotlight in the AV loop and programme',
      'Named from the stage by the MC',
    ],
    subject: 'Gala naming sponsor ($25,000)',
  },
  {
    eyebrow: 'Premiere sponsor',
    badge: 'Three only',
    title: 'Name a moment of the night',
    price: '$10,000',
    includes: [
      'A reserved table of ten',
      'Host the welcome, the bar or the auction',
      'Logo in the AV loop and programme',
      'Thanked from the stage',
    ],
    subject: 'Gala premiere sponsor ($10,000)',
  },
]

const AUCTION = [
  {
    label: 'Option 1',
    title: 'The Live Auction — the showstoppers',
    body: 'Rare, high-value or money-can’t-buy: luxury travel and stays, exclusive experiences, fine art, bespoke pieces, once-in-a-lifetime access. Six to eight items only, each introduced from the stage to a captive audience.',
  },
  {
    label: 'Option 2',
    title: 'The Silent Auction — the collection',
    body: 'Broader and accessible: hospitality and getaway packages, premium products, vouchers and curated bundles. Open for bids nationwide for ten days prior, promoted to our 40,000+ social followers and 6,000+ newsletter subscribers — reaching far beyond the room.',
  },
]

const PARTNERSHIP = [
  'Your name, logo or brand introduced to the room via the AV loop, and printed in the programme',
  'Your logo on the Gala page at everybodyeats.nz/gala',
  'Association with one of New Zealand’s most trusted social enterprises',
  'Access to our wrap-video collateral to promote on your own platforms',
  'The knowledge that your gift feeds people with dignity, long after the night ends',
]

const QUOTES = [
  {
    quote:
      'The gala dinner was a beautiful opportunity to both learn and contribute to the ongoing work of Everybody Eats and those they support. A fun, inspiring and delicious evening spent with a room full of fun, inspiring and delicious people.',
    name: 'Amber Armitage',
    place: 'Auckland',
  },
  {
    quote:
      'A fantastic evening. Great food, a wonderful atmosphere, and a cause that really matters. It’s rare to find an event that’s both genuinely enjoyable and meaningful, but this one struck that balance perfectly. I’d encourage anyone to attend.',
    name: 'Matthew Hall-White',
    place: 'Auckland',
  },
  {
    quote:
      'The word “gala” can conjure a stuffy, dry evening. But the infamous EE Gala is the opposite. Powerful speakers, delicious food, a fun atmosphere and auctions for all budgets. A certified can’t-miss hoot.',
    name: 'Freddie Coltart',
    place: 'Hawke’s Bay',
  },
  {
    quote:
      'A beautiful event with delicious food. As someone passionate about the way food can bring people together and create social change, it felt great to support an organisation actively tackling food waste, food insecurity, and loneliness in our communities.',
    name: 'Katya Old',
    place: 'Auckland',
  },
  {
    quote:
      'A fun night, delicious food and so many tempting auction items — all for a great cause. Loved it!',
    name: 'Leisha Jones',
    place: 'Auckland',
  },
]

// ── Small presentational helpers ─────────────────────────────────────────────

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.22em] font-medium ${className}`}>
      <span className="inline-block w-8 h-px bg-current opacity-50" />
      {children}
    </p>
  )
}

function CheckItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <li className="flex items-start gap-3">
      <svg
        className={`mt-1 h-4 w-4 flex-none ${className}`}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 10.5l4 4 8-9" />
      </svg>
      <span>{children}</span>
    </li>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GalaPage() {
  return (
    // -mb-32 cancels the SiteFooter's `mt-32` margin, which would otherwise
    // expose the cream body background as a gap between this dark page and the
    // (also dark) footer. The rest of the site ends on a cream surface so the
    // margin blends in there; this page is forest, so it needs the footer flush.
    <div className="bg-forest-700 text-cream-50 -mb-32">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/gala/venue.jpg"
          alt="The Everybody Eats Gala in full swing inside St Matthew-in-the-City, Auckland"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-700 via-forest-700/85 to-forest-700/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-700/80 to-transparent" />

        <div className="relative container-wide pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">Fundraising Gala · Auckland</Eyebrow>
            <h1 className="mt-6 display text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.92]">
              The{' '}
              <span className="relative inline-block">
                <em>Everybody Eats</em>
                <span
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-sun-200/90 -z-10 rounded-full"
                  aria-hidden
                />
              </span>{' '}
              Gala
            </h1>
            <p className="mt-7 text-lg sm:text-2xl text-cream-50/90 leading-snug font-display font-light">
              Auckland trades the boardroom for the ballroom — a high-class drag
              cabaret evening in support of dignity on every plate.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-base text-cream-50/85">
              <span className="flex items-center gap-2">
                <span className="text-sun-200">●</span> Friday 30 October 2026
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sun-200">●</span> St Matthew-in-the-City, Auckland CBD
              </span>
            </div>

            <div className="mt-10">
              <GalaCountdown />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={mailto(GALA_EMAIL, 'Hosting a table at the Everybody Eats Gala')}
                className="btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 text-base px-7 py-3.5"
              >
                Host a table
              </a>
              <a
                href="#sponsor"
                className="btn border border-cream-50/35 text-cream-50 hover:bg-cream-50 hover:text-forest-700 hover:border-cream-50"
              >
                Become a sponsor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── The night ────────────────────────────────────────────────────── */}
      <section className="container-wide py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <Eyebrow className="text-sun-200">The night</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              Our most <em>audacious</em> evening of the year
            </h2>
            <p className="mt-6 text-lg text-cream-50/85 leading-relaxed">
              The Everybody Eats Gala is our most audacious fundraising event —
              and this year, guests can expect a high-class drag cabaret evening
              where Auckland’s most influential names trade the boardroom for the
              ballroom.
            </p>
            <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-cream-50/90">
              {EXPERIENCE.map((item) => (
                <CheckItem key={item} className="text-sun-200">
                  {item}
                </CheckItem>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/gala/performers.jpg"
                alt="Drag performers in elaborate costume at the Everybody Eats Gala table"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The problem ──────────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow className="text-muted">The problem</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              Hunger in Aotearoa is closer than most of us think
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line/15 rounded-3xl overflow-hidden">
            {PROBLEM.map((p) => (
              <div key={p.figure} className="bg-surface px-7 py-9">
                <div className="display text-5xl sm:text-6xl font-light text-content tracking-tight">
                  {p.figure}
                </div>
                <p className="mt-4 text-sm text-content/80 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-base text-content/80 leading-relaxed">
            At the same time, 1.22 million tonnes of food are lost or wasted across
            the supply chain each year — 237&nbsp;kg for every person in the
            country. Having a job is no longer a shield.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-content/50">
            Sources: NZ Food Network 2025 Hunger Monitor · Ministry for the
            Environment · Ministry of Health
          </p>
        </div>
      </section>

      {/* ── Who we are + impact ──────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide pb-20 sm:pb-28">
          <div className="rounded-[3rem] bg-forest-700 grain text-cream-50 px-8 sm:px-14 py-16 sm:py-20 relative overflow-hidden">
            <div
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10">
              <Eyebrow className="text-sun-200">Who is Everybody Eats</Eyebrow>
              <h2 className="mt-6 display text-3xl sm:text-5xl font-light leading-tight max-w-4xl">
                A social enterprise turning rescued food into restaurant-quality,
                pay-what-you-can meals — served with <em>dignity</em>, no questions
                asked.
              </h2>
              <p className="mt-6 max-w-3xl text-cream-50/85 leading-relaxed">
                Founded in Auckland in 2017, we’ve grown from a single Monday-night
                pop-up into three permanent restaurants and nationwide pop-ups,
                built on manaakitanga, kaitiakitanga and whanaungatanga. Every
                service tackles three problems at once — food waste, food
                insecurity and social isolation — and proves dignity doesn’t have
                to cost more.
              </p>
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
                {IMPACT.map((s) => (
                  <div key={s.label}>
                    <div className="display text-4xl sm:text-5xl font-light text-cream-50 tabular-nums">
                      {s.value}
                    </div>
                    <div className="mt-2 text-sm uppercase tracking-[0.15em] text-cream-50/70">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet the performers ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-sun-200/10 blur-3xl"
          aria-hidden
        />
        <div className="relative container-wide">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">Meet the performers</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              The stars of the <em>cabaret</em>
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {PERFORMERS.map((p) => (
              <article key={p.name} className="group">
                <div className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden bg-forest-600 shadow-xl ring-1 ring-cream-50/10">
                  <Image
                    src={p.image}
                    alt={`${p.name}, ${p.role} at the Everybody Eats Gala`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-700/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="display text-2xl font-medium">{p.name}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-sun-200 mt-1">
                      {p.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-cream-50/75 leading-relaxed">{p.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the chefs ───────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow className="text-muted">Meet the chefs</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              Three courses, cooked with <em>heart</em>
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {CHEFS.map((c) => (
              <article key={c.name} className="group">
                <div className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden bg-surface-3 mb-5">
                  <Image
                    src={c.image}
                    alt={`${c.name}, Everybody Eats chef in ${c.location}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="display text-2xl font-medium text-content">{c.name}</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-muted mt-1">
                  {c.location}
                </p>
                <p className="mt-4 text-sm text-content/75 leading-relaxed">{c.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Headline the Gala (sponsorship) ──────────────────────────────── */}
      <section id="sponsor" className="scroll-mt-24 py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sun-200/10 blur-3xl"
          aria-hidden
        />
        <div className="relative container-wide">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">Get involved · Headline the Gala</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              Put your brand at the <em>centre</em> of the night
            </h2>
            <p className="mt-6 text-lg text-cream-50/85 leading-relaxed">
              Two ways to headline Auckland’s most talked-about evening — a room of
              just 200 decision-makers, business leaders, philanthropists and
              tastemakers you can’t buy your way into with ad spend.
            </p>
          </div>
          <div className="mt-14 grid lg:grid-cols-2 gap-6">
            {TIERS.map((t) => (
              <div
                key={t.eyebrow}
                className="rounded-[2rem] bg-forest-600/60 ring-1 ring-cream-50/15 p-8 sm:p-10 flex flex-col"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cream-50/70">
                    {t.eyebrow}
                  </p>
                  <span className="rounded-full bg-sun-200 text-forest-700 text-[0.65rem] font-semibold uppercase tracking-[0.12em] px-3 py-1">
                    {t.badge}
                  </span>
                </div>
                <h3 className="mt-5 display text-2xl sm:text-3xl font-light leading-snug">
                  {t.title}
                </h3>
                <div className="mt-5 display text-5xl font-light text-sun-200">{t.price}</div>
                <ul className="mt-7 space-y-3 text-sm text-cream-50/85 flex-1">
                  {t.includes.map((inc) => (
                    <CheckItem key={inc} className="text-sun-200">
                      {inc}
                    </CheckItem>
                  ))}
                </ul>
                <a
                  href={mailto(GALA_EMAIL, t.subject)}
                  className="mt-8 btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 self-start"
                >
                  Enquire about this tier
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Host a table ─────────────────────────────────────────────────── */}
      <section className="container-wide pb-20 sm:pb-28">
        <div className="rounded-[3rem] overflow-hidden grid lg:grid-cols-2 bg-forest-600/50 ring-1 ring-cream-50/15">
          <div className="p-8 sm:p-14 flex flex-col justify-center">
            <Eyebrow className="text-sun-200">Host a table</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-5xl font-light leading-tight">
              Bring your team. Host your clients.
            </h2>
            <p className="mt-6 text-cream-50/85 leading-relaxed">
              Reserve a table of ten in a room of just 200 — the kind of night your
              guests talk about long afterwards.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-cream-50/85">
              <CheckItem className="text-sun-200">
                Ten seats at a reserved table in a room of just 200
              </CheckItem>
              <CheckItem className="text-sun-200">
                Canapés on arrival, three fabulous courses, drinks throughout
              </CheckItem>
              <CheckItem className="text-sun-200">
                A high-class drag cabaret, live auctions and the full Gala
                experience
              </CheckItem>
            </ul>
            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <div className="display text-4xl font-light text-sun-200">$3,000</div>
                <div className="text-xs uppercase tracking-[0.15em] text-cream-50/60 mt-1">
                  per table of ten
                </div>
              </div>
              <div>
                <div className="display text-4xl font-light text-cream-50">$320</div>
                <div className="text-xs uppercase tracking-[0.15em] text-cream-50/60 mt-1">
                  individual seat
                </div>
              </div>
            </div>
            <a
              href={mailto(GALA_EMAIL, 'Booking a table / seats at the Everybody Eats Gala')}
              className="mt-9 btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 self-start px-7 py-3.5"
            >
              Reserve your table
            </a>
          </div>
          <div className="relative min-h-[20rem] lg:min-h-full">
            <Image
              src="/images/gala/table.jpg"
              alt="A set table at the Everybody Eats Gala with a live auction card"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Auction + in-kind ────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow className="text-muted">Donate items for auction</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              The auction is the <em>heart</em> of the night
            </h2>
            <p className="mt-6 text-lg text-content/80 leading-relaxed">
              Every item donated converts directly into meals served, and your
              generosity is named to a room of 200 of Auckland’s most influential
              guests.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {AUCTION.map((a) => (
              <div
                key={a.label}
                className="rounded-[2rem] bg-surface-2 border border-line/10 p-8 sm:p-10"
              >
                <p className="font-mono text-xs tracking-[0.2em] text-muted/70 uppercase">
                  {a.label}
                </p>
                <h3 className="mt-4 display text-2xl sm:text-3xl font-light text-content leading-snug">
                  {a.title}
                </h3>
                <p className="mt-4 text-sm text-content/80 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>

          {/* In-kind */}
          <div className="mt-6 rounded-[2rem] bg-forest-700 grain text-cream-50 p-8 sm:p-12 relative overflow-hidden">
            <div
              className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-sun-200/15 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <Eyebrow className="text-sun-200">In-kind donations</Eyebrow>
                <h3 className="mt-5 display text-2xl sm:text-3xl font-light leading-snug">
                  Pour into the night
                </h3>
                <p className="mt-4 text-cream-50/85 leading-relaxed max-w-2xl">
                  Not everything that fuels the night comes as cash. Every bottle of
                  wine, beer or spirits, every box of produce for the kitchen, every
                  gifted service — printing, AV, photography, florals — is a dollar
                  that goes to feeding people instead of running the event. We name
                  your generosity in the room and in the programme.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <a
                  href={mailto(GALA_EMAIL, 'In-kind donation for the Everybody Eats Gala')}
                  className="btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                  Offer an in-kind gift
                </a>
              </div>
            </div>
            <p className="relative z-10 mt-8 text-sm text-cream-50/70 leading-relaxed border-t border-cream-50/15 pt-6">
              Prefer to give directly? Major gifts and event underwriting make the
              biggest single difference of all —{' '}
              <a
                href={mailto(MAJOR_GIFTS_EMAIL, 'Major gift / event underwriting for the Gala')}
                className="text-sun-200 underline underline-offset-4 hover:text-sun-300"
              >
                talk to Amy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── What partnership gives you ───────────────────────────────────── */}
      <section className="container-wide py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-sun-200">What your partnership gives you</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-5xl font-light leading-tight">
              Support that <em>defends itself</em>
            </h2>
            <p className="mt-6 text-cream-50/85 leading-relaxed">
              Your support converts straight into outcomes your board and ESG
              reporting can use: meals served with dignity, kilograms diverted from
              landfill, emissions avoided, community hours mobilised. We give you the
              figures and the human story behind them.
            </p>
            <p className="mt-6 text-sm text-cream-50/70 leading-relaxed">
              Partnering is simple — tell us what you can offer and we handle the
              rest, from listing to delivery on the night. Donations close{' '}
              <strong className="text-cream-50 font-medium">Tuesday 30 September</strong>,
              giving us time to photograph, catalogue and showcase every item at its
              best. To offer an item, contact Jack at{' '}
              <a
                href={mailto(GALA_EMAIL, 'Gala auction item donation')}
                className="text-sun-200 underline underline-offset-4 hover:text-sun-300"
              >
                {GALA_EMAIL}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {PARTNERSHIP.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-5 rounded-2xl bg-forest-600/50 ring-1 ring-cream-50/10 p-6"
                >
                  <span className="font-mono text-sm text-sun-200/80 tabular-nums mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-cream-50/90 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-surface text-content">
        <div className="container-wide py-20 sm:py-28">
          <div className="max-w-3xl mb-12">
            <Eyebrow className="text-muted">Proven &amp; unforgettable</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              A certified <em>can’t-miss</em> hoot
            </h2>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
            {QUOTES.map((q, i) => (
              <figure
                key={i}
                className="break-inside-avoid mb-6 bg-surface-2 grain rounded-[2rem] p-8 border border-line/10"
              >
                <span
                  className="display block text-6xl leading-[0.6] text-sun-300 select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="mt-4 display text-lg sm:text-xl font-light leading-snug text-content">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted/80">
                  {q.name} · {q.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where the money goes ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/gala/stage.jpg"
          alt="The stage at St Matthew-in-the-City lit for the Everybody Eats Gala"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-forest-700/85" />
        <div className="relative container-wide py-24 sm:py-32">
          <div className="max-w-3xl">
            <Eyebrow className="text-sun-200">Where the money goes</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-6xl font-light leading-tight">
              Every dollar keeps the <em>doors open</em>
            </h2>
            <p className="mt-6 text-lg text-cream-50/85 leading-relaxed">
              It costs $300,000 a year to keep one of our restaurants open — the
              rent, the kitchen, the food, the core team, the doors that stay open to
              anyone who walks in. Every dollar raised at the Gala goes straight back
              into keeping those doors open.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="rounded-[2rem] bg-cream-50/10 ring-1 ring-cream-50/15 p-8">
              <div className="display text-3xl font-light text-sun-200">One seat</div>
              <p className="mt-3 text-sm text-cream-50/80 leading-relaxed">
                keeps a restaurant’s doors open for half a day.
              </p>
            </div>
            <div className="rounded-[2rem] bg-cream-50/10 ring-1 ring-cream-50/15 p-8">
              <div className="display text-3xl font-light text-sun-200">One table</div>
              <p className="mt-3 text-sm text-cream-50/80 leading-relaxed">
                keeps a restaurant open for nearly a week.
              </p>
            </div>
            <div className="rounded-[2rem] bg-sun-200 text-forest-700 p-8">
              <div className="display text-3xl font-light">$150,000+</div>
              <p className="mt-3 text-sm text-forest-700/85 leading-relaxed">
                raised in this room last year — six full months of one restaurant
                open.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="container-wide py-20 sm:py-28">
        <div className="rounded-[3rem] overflow-hidden grid lg:grid-cols-2 bg-forest-600/50 ring-1 ring-cream-50/15">
          <div className="relative min-h-[18rem] lg:min-h-full order-last lg:order-first">
            <Image
              src="/images/gala/volunteers.jpg"
              alt="Everybody Eats volunteers gathered inside the venue"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-14 flex flex-col justify-center">
            <Eyebrow className="text-sun-200">Get in touch</Eyebrow>
            <h2 className="mt-6 display text-4xl sm:text-5xl font-light leading-tight">
              Our work changes lives. We see it <em>every day.</em>
            </h2>
            <p className="mt-6 text-cream-50/85 leading-relaxed">
              We would be honoured to have your support on Friday 30 October. Host a
              table, headline the night, or donate to the auction — every gesture
              feeds people with dignity, long after the night ends.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={mailto(GALA_EMAIL, 'The Everybody Eats Gala')}
                className="btn bg-sun-200 text-forest-700 hover:bg-sun-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 px-7 py-3.5"
              >
                {GALA_EMAIL}
              </a>
              <a
                href="https://everybodyeats.nz"
                className="btn border border-cream-50/35 text-cream-50 hover:bg-cream-50 hover:text-forest-700 hover:border-cream-50"
              >
                everybodyeats.nz
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
