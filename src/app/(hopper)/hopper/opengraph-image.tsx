import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Hopper Cafe — an Everybody Eats cafe at 11 Hopper St, Te Aro, Wellington'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Hopper brand tokens (literals — this runs in the OG renderer, no Tailwind or
// the .hopper-scope CSS variables here). Mirrors hopper.css.
const LILAC = '#E8CAFE'
const INK = '#3D3100'
const HAIRLINE = 'rgba(61,49,0,0.34)'

const PUBLIC = (...p: string[]) => join(process.cwd(), 'public', ...p)

/** Load the Adigiana Toybox display TTF (the Hopper logotype face) for the OG
 *  renderer. Static font, so @vercel/og parses it fine (unlike the site's
 *  variable Fraunces). Returns null if missing so the card degrades to a
 *  system sans instead of 500-ing the social preview. */
async function loadFont(file: string): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(PUBLIC('fonts', file))
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

// The bouncy "hopper" wordmark: each letter carries the exact per-letter size
// and tilt from hopper.css (.hopper-wordmark span:nth-child), so the OG card's
// masthead matches the live poster's uneven baseline instead of a flat word.
const WORDMARK: { c: string; s: number; r?: number }[] = [
  { c: 'h', s: 0.954 },
  { c: 'o', s: 0.815 },
  { c: 'p', s: 0.733 },
  { c: 'p', s: 0.805, r: -3.8 },
  { c: 'e', s: 0.908, r: -9.4 },
  { c: 'r', s: 1 },
]
const BASE = 250 // px — the wordmark's reference cap size

export default async function HopperOgImage() {
  const display = await loadFont('AdigianaToybox.ttf')
  const fonts = display
    ? [{ name: 'Hopper', data: display, weight: 400 as const, style: 'normal' as const }]
    : []
  const family = fonts.length ? 'Hopper' : 'sans-serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '76px 84px',
          background: LILAC,
          color: INK,
          fontFamily: family,
        }}
      >
        {/* Eyebrow — the utility label from the hero kicker. */}
        <div
          style={{
            display: 'flex',
            fontSize: 27,
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          an everybody eats cafe
        </div>

        {/* Masthead — the bouncy wordmark + a small "cafe" tag, as on the poster. */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            {WORDMARK.map((l, i) => (
              <span
                key={i}
                style={{
                  display: 'flex',
                  fontSize: Math.round(BASE * l.s),
                  lineHeight: 1,
                  ...(l.r ? { transform: `rotate(${l.r}deg)` } : {}),
                }}
              >
                {l.c}
              </span>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              marginLeft: 28,
              paddingBottom: 18,
              fontSize: 30,
              letterSpacing: 9,
              textTransform: 'uppercase',
            }}
          >
            cafe
          </div>
        </div>

        {/* Footer — hairline rule, then address + hours + url. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `2px solid ${HAIRLINE}`,
            paddingTop: 30,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', fontSize: 20, letterSpacing: 6, opacity: 0.72 }}>
              FIND US
            </div>
            <div style={{ display: 'flex', fontSize: 34 }}>11 Hopper St, Te Aro</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 20, letterSpacing: 6, opacity: 0.72 }}>
              HOURS
            </div>
            <div style={{ display: 'flex', fontSize: 34 }}>Mon + Tues · 9am–2pm</div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) },
  )
}
