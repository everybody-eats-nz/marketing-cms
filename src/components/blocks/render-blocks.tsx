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
import { EnquiryFormBlock } from './enquiry-form-block'
import { PartnersGridBlock } from './partners-grid-block'
import { LocationsMagazineBlock } from './locations-magazine-block'
import { DonateHeroBlock } from './donate-hero-block'
import { ProcessBlock } from './process-block'
import { ValuesBlock } from './values-block'
import { TestimonialsBlock } from './testimonials-block'
import { DownloadsBlock } from './downloads-block'
import { GalaLandingBlock } from './gala-landing-block'
import {
  GalaNoirHeroBlock,
  GalaNoirProblemBlock,
  GalaNoirAboutBlock,
  GalaNoirNightBlock,
  GalaNoirPerformersBlock,
  GalaNoirChefsBlock,
  GalaNoirCalculatorBlock,
  GalaNoirTiersBlock,
  GalaNoirTableBlock,
  GalaNoirAuctionBlock,
  GalaNoirInKindBlock,
  GalaNoirQuotesBlock,
  GalaNoirClosingBlock,
} from './gala-noir-blocks'
import { ImpactLandingBlock } from './impact-landing-block'
import { HopperHeroBlock } from './hopper/hopper-hero-block'
import { HopperStatementBlock } from './hopper/hopper-statement-block'
import { HopperMenuBlock } from './hopper/hopper-menu-block'
import { HopperVisitBlock } from './hopper/hopper-visit-block'

type AnyBlock = { blockType: string; id?: string; [k: string]: any }

export type RenderExtras = {
  globalStats?: import('@/fields/stat-item').StatItem[]
  liveStats?: import('@/lib/impact-stats').LiveImpactStats | null
  impactStory?: import('@/lib/impact-story').ImpactStory | null
  locations?: any[]
  events?: any[]
  journal?: any[]
  team?: any[]
  faqs?: any[]
  partners?: any[]
  defaultDonateUrl?: string
  charityNumber?: string
  donateFormCopy?: import('@/lib/pay-copy').FormCopy
}

type Props = {
  blocks?: AnyBlock[] | null
  fallbackHeroHeading?: string
} & RenderExtras

export function RenderBlocks({
  blocks,
  globalStats = [],
  liveStats = null,
  impactStory = null,
  locations = [],
  events = [],
  journal = [],
  team = [],
  faqs = [],
  partners = [],
  defaultDonateUrl,
  charityNumber,
  donateFormCopy,
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
                formCopy={donateFormCopy}
              />
            )
          case 'richText':
            return <RichTextBlock key={key} block={block as any} />
          case 'media':
            return <MediaBlockRenderer key={key} block={block as any} />
          case 'stats':
            return (
              <StatsBlock
                key={key}
                block={block as any}
                globalStats={globalStats}
                liveStats={liveStats}
              />
            )
          case 'marquee':
            return <MarqueeBlock key={key} block={block as any} />
          case 'timeline':
            return <TimelineBlock key={key} block={block as any} />
          case 'process':
            return <ProcessBlock key={key} block={block as any} />
          case 'values':
            return <ValuesBlock key={key} block={block as any} />
          case 'testimonials':
            return <TestimonialsBlock key={key} block={block as any} />
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
            return <FaqsAccordionBlock key={key} block={block as any} faqs={faqs} />
          case 'partnersGrid':
            return <PartnersGridBlock key={key} block={block as any} partners={partners} />
          case 'newsletterForm':
            return <NewsletterFormBlockRenderer key={key} block={block as any} />
          case 'enquiryForm':
            return <EnquiryFormBlock key={key} block={block as any} />
          case 'downloads':
            return <DownloadsBlock key={key} block={block as any} />
          case 'galaLanding':
            return <GalaLandingBlock key={key} block={block as any} />
          case 'galaNoirHero':
            return <GalaNoirHeroBlock key={key} block={block as any} />
          case 'galaNoirProblem':
            return <GalaNoirProblemBlock key={key} block={block as any} />
          case 'galaNoirAbout':
            return <GalaNoirAboutBlock key={key} block={block as any} />
          case 'galaNoirNight':
            return <GalaNoirNightBlock key={key} block={block as any} />
          case 'galaNoirPerformers':
            return <GalaNoirPerformersBlock key={key} block={block as any} />
          case 'galaNoirChefs':
            return <GalaNoirChefsBlock key={key} block={block as any} />
          case 'galaNoirCalculator':
            return <GalaNoirCalculatorBlock key={key} block={block as any} />
          case 'galaNoirTiers':
            return <GalaNoirTiersBlock key={key} block={block as any} />
          case 'galaNoirTable':
            return <GalaNoirTableBlock key={key} block={block as any} />
          case 'galaNoirAuction':
            return <GalaNoirAuctionBlock key={key} block={block as any} />
          case 'galaNoirInKind':
            return <GalaNoirInKindBlock key={key} block={block as any} />
          case 'galaNoirQuotes':
            return <GalaNoirQuotesBlock key={key} block={block as any} />
          case 'galaNoirClosing':
            return <GalaNoirClosingBlock key={key} block={block as any} />
          case 'impactLanding':
            return impactStory ? (
              <ImpactLandingBlock
                key={key}
                block={block as any}
                story={impactStory}
                cmsLocations={locations}
              />
            ) : null
          case 'hopperHero':
            return <HopperHeroBlock key={key} block={block as any} />
          case 'hopperStatement':
            return <HopperStatementBlock key={key} block={block as any} />
          case 'hopperMenu':
            return <HopperMenuBlock key={key} block={block as any} />
          case 'hopperVisit':
            return <HopperVisitBlock key={key} block={block as any} />
          default:
            return null
        }
      })}
    </>
  )
}
