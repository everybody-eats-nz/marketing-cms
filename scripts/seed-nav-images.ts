/**
 * Apply preview images to existing primary navigation items.
 *
 * Use this when the navigation global already exists but its primary items
 * are missing the new `previewImage` field. Idempotent.
 *
 *   pnpm tsx scripts/seed-nav-images.ts
 */

import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ROOT = path.resolve(process.cwd(), 'data/webflow')

function guessMime(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  return (
    {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    }[ext] || 'application/octet-stream'
  )
}

async function uploadOrFind(payload: any, localFile: string, alt: string): Promise<string | null> {
  const filePath = path.join(ROOT, 'assets', localFile)
  if (!existsSync(filePath)) {
    console.warn(`  ✗ missing asset: ${localFile}`)
    return null
  }
  const filename = path.basename(localFile)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.totalDocs > 0) return existing.docs[0].id

  const buffer = await readFile(filePath)
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: guessMime(filename), name: filename, size: buffer.length },
  })
  return created.id
}

async function main() {
  const payload = await getPayload({ config })

  const dineId = await uploadOrFind(
    payload,
    '66da1b61c565fbd49ef16956_diners.jpg',
    'Diners enjoying a meal at Everybody Eats',
  )
  const involvedId = await uploadOrFind(
    payload,
    '66de6b9a3555ab75c618a795_Alex-McVinnie_K9A4777-2.jpg',
    'A volunteer stirring a pot in the Everybody Eats kitchen',
  )
  const storyId = await uploadOrFind(
    payload,
    '67e2378394cdd938f52d6b15_WLGPP25-Parade-154.jpg',
    'Everybody Eats team at the Wellington Pride Parade',
  )

  const nav = await payload.findGlobal({ slug: 'navigation' })
  const primary = (nav as any).primary || []
  const labelToImage: Record<string, string | null> = {
    'Dine with us': dineId,
    'Get involved': involvedId,
    'Our story': storyId,
  }

  const updatedPrimary = primary.map((item: any) => {
    const label = item?.link?.label
    const previewImage = labelToImage[label] ?? item.previewImage ?? null
    return { ...item, previewImage }
  })

  await payload.updateGlobal({
    slug: 'navigation',
    data: { primary: updatedPrimary },
  })

  console.log('✓ navigation primary previewImage values updated')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
