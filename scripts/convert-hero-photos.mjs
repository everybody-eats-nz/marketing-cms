// One-off: convert the high-res Everybody Eats source JPGs from ~/Downloads into
// web-optimised webp frames for the hero carousel (src/assets/photos/).
// Run: node scripts/convert-hero-photos.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const DL = join(homedir(), 'Downloads')
const OUT = join(process.cwd(), 'src/assets/photos')
mkdirSync(OUT, { recursive: true })

// [source filename in ~/Downloads, output slug]
const FILES = [
  ['142-WEAllAotearoa-Conference2024-HighResPrint.jpg', '142-weallaotearoa-conference2024'],
  ['143-WEAllAotearoa-Conference2024-HighResPrint.jpg', '143-weallaotearoa-conference2024'],
  ['150-WEAllAotearoa-Conference2024-HighResPrint.jpg', '150-weallaotearoa-conference2024'],
  ['2025_WOAP_BOILUP-08-2.jpg', 'woap-boilup-08-2'],
  ['2025_WOAP_W2-09.jpg', 'woap-w2-09'],
  ['2025_WOAP_W2-10.jpg', 'woap-w2-10'],
  ['2025_WOAP_W2-13.jpg', 'woap-w2-13'],
  ['2025_WOAP_W2-16.jpg', 'woap-w2-16'],
  ['2025_WOAP_W2-17.jpg', 'woap-w2-17'],
  ['2025_WOAP_W2-19.jpg', 'woap-w2-19'],
  ['2025_WOAP_W4-06.jpg', 'woap-w4-06'],
  ['2025_WOAP_W4-08.jpg', 'woap-w4-08'],
  ['2025_WOAP_W4-11.jpg', 'woap-w4-11'],
  ['CB01605-064 Everybody Eats.jpg', 'cb01605-064'],
  ['CB01605-078 Everybody Eats.jpg', 'cb01605-078'],
  ['CB01605-094 Everybody Eats.jpg', 'cb01605-094'],
  ['CB01605-099 Everybody Eats.jpg', 'cb01605-099'],
  ['CB01605-122 Everybody Eats.jpg', 'cb01605-122'],
  ['CB01605-123 Everybody Eats.jpg', 'cb01605-123'],
  ['CB01605-127 Everybody Eats.jpg', 'cb01605-127'],
  ['CB01605-130 Everybody Eats.jpg', 'cb01605-130'],
  ['CB01605-143 Everybody Eats.jpg', 'cb01605-143'],
  ['CB01605-144 Everybody Eats.jpg', 'cb01605-144'],
  ['CB01605-150 Everybody Eats.jpg', 'cb01605-150'],
  ['CB01605-151 Everybody Eats.jpg', 'cb01605-151'],
  ['CB01605-152 Everybody Eats.jpg', 'cb01605-152'],
  ['CB01605-153 Everybody Eats.jpg', 'cb01605-153'],
  ['CB01605-160 Everybody Eats.jpg', 'cb01605-160'],
  ['Onehunga2.jpg', 'onehunga2'],
  ['Onehunga3.jpg', 'onehunga3'],
]

let ok = 0
for (const [src, slug] of FILES) {
  try {
    await sharp(join(DL, src))
      .rotate() // honour EXIF orientation
      // Downsize only — keep the native aspect ratio and let the carousel's CSS
      // object-cover frame each photo (matches the reference implementation).
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(OUT, `${slug}.webp`))
    ok++
    console.log('✓', slug)
  } catch (e) {
    console.error('✗', src, '-', e.message)
  }
}
console.log(`\n${ok}/${FILES.length} converted → ${OUT}`)
