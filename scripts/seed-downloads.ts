/**
 * Upload the catering / team-experience PDFs into the `documents` collection
 * and attach a Downloads block to the catering and team pages.
 *
 * Idempotent:
 *   - documents are upserted by title (re-running replaces the file bytes);
 *   - each page's Downloads block is replaced in place if one already exists,
 *     otherwise inserted just before the enquiry form (or appended).
 *
 * Source PDFs default to ~/Downloads — override with DOWNLOADS_DIR. Requires the
 * `documents` table to exist (run `pnpm migrate` first).
 *
 * Usage:
 *   pnpm tsx scripts/seed-downloads.ts
 */

import 'dotenv/config'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const SOURCE_DIR = process.env.DOWNLOADS_DIR || path.join(os.homedir(), 'Downloads')

type DocSpec = { file: string; title: string; description?: string }

// Each page gets its own ordered list of documents, with heading copy grounded
// in the existing page content.
const PAGES: Array<{
  slug: string
  heading: string
  intro?: string
  docs: DocSpec[]
}> = [
  {
    slug: 'get-involved/catering-events',
    heading: 'Take the details *with you*.',
    intro: 'Download our catering and fundraising information to share with your team.',
    docs: [
      {
        file: 'EE-Catering.pdf',
        title: 'Catering menu & services',
        description:
          'Good kai delivered fresh — from lunch boxes and sharing platters to canapés and bespoke full-service dinners.',
      },
      {
        file: 'Dine for Good Proposal.pdf',
        title: 'Dine for Good',
        description:
          'Our fundraising dining series fills great restaurants with food-loving supporters for one special night.',
      },
    ],
  },
  {
    slug: 'get-involved/cooking-sessions',
    heading: 'Explore each *experience*.',
    intro: 'Download the details for each team experience to find the right fit for your group.',
    docs: [
      {
        file: 'Step into Service 300526.pdf',
        title: 'Step into Service',
        description:
          'Join our kitchen or front-of-house team during a service and see how rescued food becomes a three-course meal.',
      },
      { file: 'Meals that Matter 220526.pdf', title: 'Meals that Matter' },
      { file: 'Everybody Eats on the Road 300526.pdf', title: 'Everybody Eats on the Road' },
      { file: 'Private Event 300526.pdf', title: 'Private Events' },
    ],
  },
]

async function main() {
  const payload = await getPayload({ config })

  // 1. Upsert every referenced document, keyed by title.
  const idByTitle = new Map<string, string | number>()
  const allDocs = PAGES.flatMap((p) => p.docs)
  for (const spec of allDocs) {
    const filePath = path.join(SOURCE_DIR, spec.file)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing PDF: ${filePath} (set DOWNLOADS_DIR to the folder holding the PDFs)`)
    }

    const existing = await payload.find({
      collection: 'documents',
      where: { title: { equals: spec.title } },
      limit: 1,
      depth: 0,
    })

    const data = { title: spec.title, description: spec.description }
    let id: string | number
    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'documents',
        id: (existing.docs[0] as any).id,
        data,
        filePath,
      })
      id = (updated as any).id
      console.log(`↻ updated document: ${spec.title}`)
    } else {
      const created = await payload.create({
        collection: 'documents',
        data,
        filePath,
      })
      id = (created as any).id
      console.log(`✓ uploaded document: ${spec.title}`)
    }
    idByTitle.set(spec.title, id)
  }

  // 2. Attach / refresh the Downloads block on each page.
  for (const page of PAGES) {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
    })
    const doc = found.docs[0] as any
    if (!doc) {
      console.warn(`⚠ page not found, skipping: ${page.slug}`)
      continue
    }

    const downloadsBlock = {
      blockType: 'downloads',
      eyebrow: 'Resources',
      heading: page.heading,
      intro: page.intro,
      columns: '2',
      items: page.docs.map((d) => ({ file: idByTitle.get(d.title) })),
    }

    const layout: any[] = Array.isArray(doc.layout) ? [...doc.layout] : []
    const existingIdx = layout.findIndex((b) => b.blockType === 'downloads')
    if (existingIdx !== -1) {
      // Preserve the block's id so the version history stays clean.
      layout[existingIdx] = { ...downloadsBlock, id: layout[existingIdx].id }
    } else {
      const enquiryIdx = layout.findIndex((b) => b.blockType === 'enquiryForm')
      const insertAt = enquiryIdx === -1 ? layout.length : enquiryIdx
      layout.splice(insertAt, 0, downloadsBlock)
    }

    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout, _status: 'published' },
    })
    console.log(`✓ ${existingIdx !== -1 ? 'updated' : 'added'} Downloads block on /${page.slug}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
