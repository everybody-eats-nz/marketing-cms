import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Pages } from './collections/Pages'
import { Locations } from './collections/Locations'
import { TeamMembers } from './collections/TeamMembers'
import { Events } from './collections/Events'
import { JournalPosts } from './collections/JournalPosts'
import { Quotes } from './collections/Quotes'
import { Faqs } from './collections/Faqs'
import { Partners } from './collections/Partners'
import { Donations } from './collections/Donations'
import { Feedback } from './collections/Feedback'

import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { PaySettings } from './globals/PaySettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Object storage for media uploads (S3-compatible: Cloudflare R2, MinIO, Backblaze
// B2, AWS S3). Activates only when S3_BUCKET is set — otherwise media falls back to
// local-disk storage (Media.ts staticDir), which is convenient for local dev.
//
// On a containerised host (Coolify) local disk is fragile: files don't survive
// redeploys and can't be seeded into prod from a laptop (the bytes land wherever
// the script runs). Object storage fixes both — the destination is the bucket,
// regardless of where the upload/seed runs. Files are streamed through Payload's
// own route, so the bucket does NOT need to be publicly readable.
//
// The plugin is ALWAYS registered (toggled via `enabled`) with `alwaysInsertFields`,
// so the admin importMap and collection schema are identical across dev, build, and
// prod. Gating the whole plugin on the env var instead would generate a build-time
// importMap without the S3 client component, then fail at runtime when S3 is on.
const storagePlugins = [
  s3Storage({
    enabled: Boolean(process.env.S3_BUCKET),
    alwaysInsertFields: true,
    collections: {
      // prefix must be set explicitly (even empty): when the plugin is enabled it
      // ignores alwaysInsertFields and only adds the `prefix` field if a prefix
      // option exists, while the disabled path always adds it. Without this, the
      // schema differs between S3 and non-S3 environments and schema push tries
      // to drop the media.prefix column on deploy. '' keeps file keys unprefixed.
      media: { prefix: '' },
      // Same rationale as media (prefix must be set explicitly), but namespaced
      // under `documents/` so PDFs don't share the bucket root with media —
      // both collections live in the same R2 bucket, so an unprefixed document
      // and media file with the same filename would otherwise overwrite.
      documents: { prefix: 'documents' },
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'auto',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      // Path-style addressing — required by MinIO, works with R2. Set
      // S3_FORCE_PATH_STYLE=false for providers that need virtual-hosted URLs.
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    },
  }),
]

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
    Documents,
    Pages,
    Locations,
    TeamMembers,
    Events,
    JournalPosts,
    Quotes,
    Faqs,
    Partners,
    Donations,
    Feedback,
  ],
  globals: [SiteSettings, Navigation, Footer, PaySettings],
  plugins: storagePlugins,
  editor: lexicalEditor(),
  email: resendAdapter({
    defaultFromName: 'Everybody Eats CMS',
    defaultFromAddress: process.env.RESEND_FROM_ADDRESS || '',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Drizzle schema push is dev-only. In production (and any non-TTY context)
    // push can prompt interactively on destructive changes and hang the deploy —
    // schema changes ship as checked-in migrations instead (pnpm migrate:create),
    // run by docker-entrypoint.sh before the server starts. PAYLOAD_DISABLE_PUSH
    // also opts out in dev (e.g. worktree previews against a drifted shared DB,
    // where push would prompt on stale columns and block a non-TTY server).
    push: process.env.NODE_ENV === 'development' && process.env.PAYLOAD_DISABLE_PUSH !== 'true',
  }),
  sharp,
  cors: [process.env.NEXT_PUBLIC_SITE_URL || ''].filter(Boolean),
})
