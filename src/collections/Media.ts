import path from 'path'
import type { CollectionConfig } from 'payload'

// Absolute path so the location is the same in dev (cwd = repo root) and in
// Docker (cwd = /app), and matches the volume mount point in production.
const mediaDir = path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: {
    useAsTitle: 'filename',
    description:
      'Uploads are converted to WebP and resized automatically (up to 2000px wide) — no need to compress beforehand. Photos should be at least 2000px on the long edge; each field says if it needs something more specific.',
  },
  upload: {
    staticDir: mediaDir,
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'feature', width: 1400 },
      { name: 'hero', width: 2000 },
    ],
    mimeTypes: ['image/*', 'video/*'],
    adminThumbnail: 'thumbnail',
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: { description: 'Alt text for accessibility. Leave empty for decorative images.' },
    },
    { name: 'caption', type: 'text' },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photo credit / attribution (optional)' },
    },
  ],
}
