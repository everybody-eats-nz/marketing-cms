import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve(process.cwd(), 'data/webflow/html')

const URLS: Array<[string, string]> = [
  ['/about-us/our-team', 'our-team'],
  ['/about-us/journal', 'journal'],
  ['/about-us/contact-us', 'contact-us'],
  ['/about-us/faqs', 'faqs'],
  ['/about-us/newsletter', 'newsletter'],
  ['/get-involved/donate', 'donate'],
  ['/get-involved/partner', 'partner'],
  ['/get-involved/regular-giving', 'regular-giving'],
  ['/get-involved/corporate-giving', 'corporate-giving'],
  ['/get-involved/fundraise-for-everybody-eats', 'fundraise'],
  ['/get-involved/cooking-sessions', 'cooking-sessions'],
  ['/get-involved/school-sessions', 'school-sessions'],
  ['/get-involved/corporate-groups', 'corporate-groups'],
  ['/get-involved/meals-that-matter', 'meals-that-matter'],
  ['/hygiene/privacy-policy', 'privacy-policy'],
  ['/hygiene/terms-and-conditions', 'terms-and-conditions'],
  ['/about-us/where-we-are-today', 'where-we-are-today'],
  ['/about-us/the-journey-so-far', 'the-journey-so-far'],
  ['/about-us/our-mission-and-ambition', 'our-mission'],
  ['/partners/hospitality-partners', 'hospitality-partners'],
  ['/partners/food-partners', 'food-partners'],
  ['/partners/funding-partners', 'funding-partners'],
  ['/partners/supporting-partners', 'supporting-partners'],
  ['/dine-with-us/pay/all', 'pay-all'],
  ['/dine-with-us/catering-events', 'catering-events'],
  ['/dine-with-us/save-a-bite', 'save-a-bite'],
  ['/dine-with-us/special-events-2', 'special-events'],
  ['/dine-with-us/restaraunt-takeovers', 'restaurant-takeovers'],
  ['/dine-with-us/guest-chefs', 'guest-chefs'],
]

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const [url, name] of URLS) {
    try {
      const res = await fetch(`https://www.everybodyeats.nz${url}`, { redirect: 'follow' })
      if (!res.ok) {
        console.log(`  ✗ ${url} -> ${res.status}`)
        continue
      }
      const html = await res.text()
      // Filter out actual 404 responses (chomp template title)
      if (html.includes('404 error') || html.includes('Chomp - Webflow')) {
        console.log(`  ✗ ${url} -> 404 page rendered`)
        continue
      }
      await writeFile(path.join(OUT, `${name}.html`), html, 'utf8')
      console.log(`  ✓ ${url.padEnd(50)} (${(html.length / 1024).toFixed(0)} kB)`)
    } catch (e) {
      console.log(`  ! ${url}: ${(e as Error).message}`)
    }
    await sleep(150)
  }
}

main().catch(console.error)
