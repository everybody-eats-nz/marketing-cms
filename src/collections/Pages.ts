import type { CollectionConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { RichText } from '../blocks/RichText'
import { Stats } from '../blocks/Stats'
import { Marquee } from '../blocks/Marquee'
import { LocationsGrid } from '../blocks/LocationsGrid'
import { Pillars } from '../blocks/Pillars'
import { EventsList } from '../blocks/EventsList'
import { JournalList } from '../blocks/JournalList'
import { CtaStrip } from '../blocks/CtaStrip'
import { CardGrid } from '../blocks/CardGrid'
import { Timeline } from '../blocks/Timeline'
import { TeamGrid } from '../blocks/TeamGrid'
import { FaqsAccordion } from '../blocks/FaqsAccordion'
import { NewsletterFormBlock } from '../blocks/NewsletterFormBlock'
import { EnquiryForm } from '../blocks/EnquiryForm'
import { PartnersGrid } from '../blocks/PartnersGrid'
import { LocationsMagazine } from '../blocks/LocationsMagazine'
import { MediaBlock } from '../blocks/MediaBlock'
import { DonateHero } from '../blocks/DonateHero'
import { Process } from '../blocks/Process'
import { Values } from '../blocks/Values'
import { Testimonials } from '../blocks/Testimonials'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const slug = (data?.slug as string) || ''
        const path = slug === 'home' ? '/' : `/${slug}`
        return `${base}/api/preview?path=${encodeURIComponent(path)}`
      },
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 667 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
  },
  access: {
    read: () => true,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL path, e.g. "about" or "locations/wellington"' },
    },
    {
      name: 'layout',
      type: 'blocks',
      admin: {
        description: 'Page sections. Add a Hero first, then stack content blocks beneath.',
      },
      blocks: [
        Hero,
        DonateHero,
        RichText,
        MediaBlock,
        Stats,
        Marquee,
        Timeline,
        Process,
        Values,
        Testimonials,
        CardGrid,
        Pillars,
        CtaStrip,
        LocationsGrid,
        LocationsMagazine,
        EventsList,
        JournalList,
        TeamGrid,
        FaqsAccordion,
        PartnersGrid,
        NewsletterFormBlock,
        EnquiryForm,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
