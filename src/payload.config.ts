import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Locations } from './collections/Locations'
import { TeamMembers } from './collections/TeamMembers'
import { Events } from './collections/Events'
import { JournalPosts } from './collections/JournalPosts'
import { Quotes } from './collections/Quotes'
import { Faqs } from './collections/Faqs'
import { Partners } from './collections/Partners'
import { DailyMenus } from './collections/DailyMenus'

import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Everybody Eats CMS',
      icons: [],
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Locations,
    TeamMembers,
    Events,
    JournalPosts,
    Quotes,
    Faqs,
    Partners,
    DailyMenus,
  ],
  globals: [SiteSettings, Navigation, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  cors: [process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean),
})
