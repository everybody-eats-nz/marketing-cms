import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt =
  'Toast — a pop-up community cafe from Everybody Eats at 306 Onehunga Mall, Onehunga, Auckland'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Toast brand tokens (literals — this runs in the OG renderer, no Tailwind or
// the .toast-scope CSS variables here). Mirrors toast.css.
const PAPER = '#FFF69B'
const INK = '#3D3100'
const HAIRLINE = 'rgba(61,49,0,0.34)'

const PUBLIC = (...p: string[]) => join(process.cwd(), 'public', ...p)

/** Load a static TTF for the OG renderer. Returns null if missing so the card
 *  degrades to the bundled sans instead of 500-ing the social preview. */
async function loadFont(file: string): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(PUBLIC('fonts', file))
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

/** The drawn wordmark, inlined as a data URI — the same asset the page hero
 *  uses, so the card and the page can never drift apart. */
async function loadWordmark(): Promise<string | null> {
  try {
    const svg = await readFile(PUBLIC('toast-logo.svg'))
    return `data:image/svg+xml;base64,${svg.toString('base64')}`
  } catch {
    return null
  }
}

// Natural proportions of the trimmed wordmark asset.
const WORDMARK_RATIO = 182.87 / 59.39
const WORDMARK_WIDTH = 620

export default async function ToastOgImage() {
  const [regular, bold, wordmark] = await Promise.all([
    loadFont('RobotoMono-Regular-OG.ttf'),
    loadFont('RobotoMono-Bold-OG.ttf'),
    loadWordmark(),
  ])
  const fonts = [
    ...(regular
      ? [{ name: 'Mono', data: regular, weight: 400 as const, style: 'normal' as const }]
      : []),
    ...(bold ? [{ name: 'Mono', data: bold, weight: 700 as const, style: 'normal' as const }] : []),
  ]
  const family = fonts.length ? 'Mono' : 'sans-serif'

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
          background: PAPER,
          color: INK,
          fontFamily: family,
        }}
      >
        {/* Eyebrow — the hero kicker, with the address balancing the row so the
            card carries the location even when it is shared without a caption. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 25,
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex' }}>an everybody eats cafe</div>
          <div style={{ display: 'flex' }}>306 onehunga mall</div>
        </div>

        {/* Masthead — the drawn wordmark, then the descriptor beneath it. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {wordmark ? (
            <img
              src={wordmark}
              alt=""
              width={WORDMARK_WIDTH}
              height={Math.round(WORDMARK_WIDTH / WORDMARK_RATIO)}
            />
          ) : (
            <div style={{ display: 'flex', fontSize: 150, fontWeight: 700 }}>toast</div>
          )}
          <div
            style={{ display: 'flex', fontSize: 27, letterSpacing: 9, textTransform: 'uppercase' }}
          >
            pop-up community cafe
          </div>
        </div>

        {/* Footer — hairline rule, then the opening hours. */}
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
              FRIDAY
            </div>
            <div style={{ display: 'flex', fontSize: 34 }}>7.30am – 2.30pm</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 20, letterSpacing: 6, opacity: 0.72 }}>
              SAT + SUN
            </div>
            <div style={{ display: 'flex', fontSize: 34 }}>8.30am – 2.30pm</div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) },
  )
}
