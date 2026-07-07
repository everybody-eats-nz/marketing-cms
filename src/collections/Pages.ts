import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'
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
import { Downloads } from '../blocks/Downloads'
import { GalaLanding } from '../blocks/GalaLanding'
import { ImpactLanding } from '../blocks/ImpactLanding'

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
  hooks: {
    // Stamp the acting admin user on every save so each version records who did
    // what. Versions snapshot all fields, so these surface per-version in the
    // Versions tab as an audit trail. All are only set when there's an
    // authenticated user (seed/API writes with no req.user leave them null).
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user) {
          // Who last saved this version.
          data.updatedBy = req.user.id
          // Who originally created the page - set once on create, then preserved
          // across every later edit (updatedBy would otherwise overwrite it).
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          // Who published - stamped only on a save that results in a published
          // status, so it records the publisher rather than the drafter.
          if (data._status === 'published') {
            data.publishedBy = req.user.id
          }
        }
        return data
      },
    ],
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
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The admin user who last saved this version.',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The admin user who originally created this page.',
      },
    },
    {
      name: 'publishedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The admin user who published this version.',
      },
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
        Downloads,
        GalaLanding,
        ImpactLanding,
      ],
    },
    seoField,
  ],
}
