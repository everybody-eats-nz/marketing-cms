import path from 'path'
import type { CollectionConfig } from 'payload'

// Absolute path so the location is the same in dev (cwd = repo root) and in
// Docker (cwd = /app), and matches the volume mount point in production.
const documentsDir = path.resolve(process.cwd(), 'documents')

// Downloadable files (PDFs: catering decks, team-experience proposals, etc.).
// Kept separate from `media` because these are documents, not images — no Sharp
// image sizes, and a different mime-type allow-list. Streamed through Payload's
// own route, so the bucket does not need to be publicly readable. Like `media`,
// the S3 plugin is registered for this collection in payload.config.ts and only
// activates when S3_BUCKET is set.
export const Documents: CollectionConfig = {
  slug: 'documents',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'updatedAt'],
    group: 'Media',
  },
  upload: {
    staticDir: documentsDir,
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Human-friendly name shown in the admin and as the default download label.' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Optional short summary, used as the default description on download cards.' },
    },
  ],
}
