/**
 * Webflow content extractor for everybodyeats.nz
 *
 * Pulls:
 *   - Site metadata + pages (via Data API)
 *   - Every CMS collection + every item (via Data API)
 *   - Each item's referenced images (downloaded to data/webflow/assets)
 *   - Each published page's rendered HTML (so we can mine static page copy
 *     that Webflow doesn't expose in the Data API)
 *
 * Output:
 *   data/webflow/
 *     site.json
 *     pages.json
 *     collections/<slug>.json
 *     html/<slug>.html
 *     assets/<filename>
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'

const TOKEN = process.env.WEBFLOW_API_TOKEN
const SITE_ID = process.env.WEBFLOW_SITE_ID
const PUBLIC_URL = process.env.WEBFLOW_PUBLIC_URL || 'https://www.everybodyeats.nz'
const OUT = path.resolve(process.cwd(), 'data/webflow')

if (!TOKEN) {
  console.error('Missing WEBFLOW_API_TOKEN env var')
  process.exit(1)
}

const API = 'https://api.webflow.com/v2'
const headers = {
  authorization: `Bearer ${TOKEN}`,
  'accept-version': '2.0.0',
}

async function api<T>(pathname: string): Promise<T> {
  const res = await fetch(`${API}${pathname}`, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${pathname} -> ${res.status} ${res.statusText}\n${body}`)
  }
  return res.json() as Promise<T>
}

async function writeJSON(file: string, data: unknown) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(data, null, 2), 'utf8')
  console.log(`  → ${path.relative(process.cwd(), file)}`)
}

async function downloadAsset(url: string): Promise<string | null> {
  try {
    const u = new URL(url)
    const filename = path.basename(u.pathname)
    const dest = path.join(OUT, 'assets', filename)
    if (existsSync(dest)) return filename
    await mkdir(path.dirname(dest), { recursive: true })
    const res = await fetch(url)
    if (!res.ok || !res.body) return null
    // @ts-expect-error node Web stream interop
    await pipeline(res.body, createWriteStream(dest))
    return filename
  } catch (e) {
    console.warn(`  ! asset failed ${url}: ${(e as Error).message}`)
    return null
  }
}

async function getSiteId(): Promise<string> {
  if (SITE_ID) return SITE_ID
  type Sites = { sites: Array<{ id: string; displayName: string; shortName: string }> }
  const data = await api<Sites>('/sites')
  console.log('Sites available on this token:')
  data.sites.forEach((s) => console.log(`  - ${s.displayName} (${s.shortName}) :: ${s.id}`))
  const ee = data.sites.find(
    (s) =>
      /everybody/i.test(s.displayName) ||
      /everybody/i.test(s.shortName) ||
      /eats/i.test(s.shortName),
  )
  if (!ee) {
    throw new Error('Could not auto-detect Everybody Eats site. Set WEBFLOW_SITE_ID in .env')
  }
  console.log(`Using site: ${ee.displayName} (${ee.id})`)
  return ee.id
}

async function dumpSite(siteId: string) {
  console.log('\n→ Site metadata')
  const site = await api(`/sites/${siteId}`)
  await writeJSON(path.join(OUT, 'site.json'), site)
}

async function dumpPages(siteId: string) {
  console.log('\n→ Pages')
  type PagesResp = { pages: Array<{ id: string; slug: string; title: string }> }
  const list = await api<PagesResp>(`/sites/${siteId}/pages`)
  await writeJSON(path.join(OUT, 'pages.json'), list)
  await mkdir(path.join(OUT, 'pages'), { recursive: true })
  for (const page of list.pages) {
    try {
      const detail = await api(`/pages/${page.id}`)
      const content = await api(`/pages/${page.id}/dom`).catch(() => null)
      await writeJSON(path.join(OUT, 'pages', `${page.slug || page.id}.json`), {
        ...detail,
        dom: content,
      })
    } catch (e) {
      console.warn(`  ! page ${page.slug} failed: ${(e as Error).message}`)
    }
  }
}

async function dumpCollections(siteId: string) {
  console.log('\n→ Collections')
  type CollectionsResp = { collections: Array<{ id: string; displayName: string; slug: string }> }
  const list = await api<CollectionsResp>(`/sites/${siteId}/collections`)
  await writeJSON(path.join(OUT, 'collections.json'), list)
  await mkdir(path.join(OUT, 'collections'), { recursive: true })

  for (const col of list.collections) {
    console.log(`  • ${col.displayName} (${col.slug})`)
    try {
      const schema = await api(`/collections/${col.id}`)
      const items: any[] = []
      let offset = 0
      const limit = 100
      while (true) {
        type ItemsResp = { items: any[]; pagination: { total: number } }
        const page = await api<ItemsResp>(
          `/collections/${col.id}/items?limit=${limit}&offset=${offset}`,
        )
        items.push(...page.items)
        if (items.length >= page.pagination.total) break
        offset += limit
      }

      // Download image assets referenced inside fieldData
      for (const item of items) {
        const fd = item.fieldData || {}
        for (const [k, v] of Object.entries(fd)) {
          if (v && typeof v === 'object' && (v as any).url && (v as any).fileId) {
            const filename = await downloadAsset((v as any).url)
            if (filename) (v as any)._localFile = filename
          }
          if (Array.isArray(v)) {
            for (const item2 of v) {
              if (item2 && typeof item2 === 'object' && item2.url && item2.fileId) {
                const filename = await downloadAsset(item2.url)
                if (filename) item2._localFile = filename
              }
            }
          }
        }
      }

      await writeJSON(path.join(OUT, 'collections', `${col.slug}.json`), {
        schema,
        items,
      })
    } catch (e) {
      console.warn(`  ! collection ${col.slug} failed: ${(e as Error).message}`)
    }
  }
}

async function dumpPublicHtml() {
  console.log('\n→ Public HTML (static page copy)')
  await mkdir(path.join(OUT, 'html'), { recursive: true })
  const slugs = [
    '',
    'about',
    'our-story',
    'locations',
    'wellington',
    'onehunga',
    'st-kevins',
    'menu',
    'donate',
    'support-us',
    'volunteer',
    'contact',
    'media',
    'news',
    'faq',
  ]
  for (const slug of slugs) {
    const url = `${PUBLIC_URL.replace(/\/$/, '')}/${slug}`
    try {
      const res = await fetch(url, { redirect: 'follow' })
      if (!res.ok) {
        console.log(`  - ${slug || '/'} -> ${res.status}`)
        continue
      }
      const html = await res.text()
      const file = path.join(OUT, 'html', `${slug || 'home'}.html`)
      await writeFile(file, html, 'utf8')
      console.log(`  ✓ ${slug || '/'} (${(html.length / 1024).toFixed(1)} kB)`)
    } catch (e) {
      console.warn(`  ! ${slug} failed: ${(e as Error).message}`)
    }
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const siteId = await getSiteId()
  await dumpSite(siteId)
  await dumpPages(siteId)
  await dumpCollections(siteId)
  await dumpPublicHtml()
  console.log('\n✓ Done. Output in data/webflow/')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
