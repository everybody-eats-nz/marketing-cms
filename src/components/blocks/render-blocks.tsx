import { HeroBlock } from './hero-block'
import { RichTextBlock } from './rich-text-block'
import { StatsBlock } from './stats-block'
import { MarqueeBlock } from './marquee-block'
import { LocationsGridBlock } from './locations-grid-block'
import { PillarsBlock } from './pillars-block'
import { EventsListBlock } from './events-list-block'
import { JournalListBlock } from './journal-list-block'
import { CtaStripBlock } from './cta-strip-block'
import { CardGridBlock } from './card-grid-block'
import { TimelineBlock } from './timeline-block'
import { MediaBlockRenderer } from './media-block'
import { TeamGridBlock } from './team-grid-block'
import { FaqsAccordionBlock } from './faqs-accordion-block'
import { NewsletterFormBlockRenderer } from './newsletter-form-block'
import { PartnersGridBlock } from './partners-grid-block'
import { LocationsMagazineBlock } from './locations-magazine-block'
import { DonateHeroBlock } from './donate-hero-block'

type AnyBlock = { blockType: string; id?: string; [k: string]: any }

export type RenderExtras = {
  globalStats?: Array<{ value: string; label: string }>
  locations?: any[]
  events?: any[]
  journal?: any[]
  team?: any[]
  faqs?: any[]
  partners?: any[]
  defaultDonateUrl?: string
  charityNumber?: string
}

type Props = {
  blocks?: AnyBlock[] | null
  fallbackHeroHeading?: string
} & RenderExtras

export function RenderBlocks({
  blocks,
  globalStats = [],
  locations = [],
  events = [],
  journal = [],
  team = [],
  faqs = [],
  partners = [],
  defaultDonateUrl,
  charityNumber,
  fallbackHeroHeading,
}: Props) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id || `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} block={block as any} fallbackHeading={fallbackHeroHeading} />
          case 'donateHero':
            return (
              <DonateHeroBlock
                key={key}
                block={block as any}
                defaultDonateUrl={defaultDonateUrl}
                charityNumber={charityNumber}
              />
            )
          case 'richText':
            return <RichTextBlock key={key} block={block as any} />
          case 'media':
            return <MediaBlockRenderer key={key} block={block as any} />
          case 'stats':
            return <StatsBlock key={key} block={block as any} globalStats={globalStats} />
          case 'marquee':
            return <MarqueeBlock key={key} block={block as any} />
          case 'timeline':
            return <TimelineBlock key={key} block={block as any} />
          case 'cardGrid':
            return <CardGridBlock key={key} block={block as any} />
          case 'pillars':
            return <PillarsBlock key={key} block={block as any} />
          case 'ctaStrip':
            return <CtaStripBlock key={key} block={block as any} />
          case 'locationsGrid':
            return <LocationsGridBlock key={key} block={block as any} locations={locations} />
          case 'locationsMagazine':
            return <LocationsMagazineBlock key={key} locations={locations} />
          case 'eventsList':
            return <EventsListBlock key={key} block={block as any} events={events} />
          case 'journalList':
            return <JournalListBlock key={key} block={block as any} journal={journal} />
          case 'teamGrid':
            return <TeamGridBlock key={key} team={team} />
          case 'faqsAccordion':
            return <FaqsAccordionBlock key={key} faqs={faqs} />
          case 'partnersGrid':
            return <PartnersGridBlock key={key} block={block as any} partners={partners} />
          case 'newsletterForm':
            return <NewsletterFormBlockRenderer key={key} block={block as any} />
          default:
            return null
        }
      })}
    </>
  )
}
