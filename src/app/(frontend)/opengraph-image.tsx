import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Everybody Eats — pay-as-you-feel restaurants in Aotearoa'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand palette (literals — this runs in the OG renderer, no Tailwind here).
const FOREST = '#1D5337'
const FOREST_DEEP = '#143B27'
const CREAM = '#FBF7EF'
const SUN = '#F8FB69'
const INK = '#163F2A' // the logo's native fill, recoloured to cream below

const PUBLIC = (...p: string[]) => join(process.cwd(), 'public', ...p)

// next/og's font parser (@vercel/og) can't read variable-font `fvar` tables, so
// it chokes on the site's variable Fraunces TTFs. We ship pre-instanced single-
// weight Fraunces cuts (generated from the same OFL variable fonts) purely for
// this renderer: Fraunces-OG (display roman) + Fraunces-Italic-OG (lighter, to
// echo the site's editorial `.display em`).
/** Load a self-hosted Fraunces TTF for the OG renderer. Returns null (rather
 *  than throwing) if the file is missing so the card degrades to the default
 *  font instead of 500-ing the social-share preview. */
async function loadFont(file: string): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(PUBLIC('fonts', file))
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

/** The real Everybody Eats wordmark, recoloured from ink to cream so it reads on
 *  the forest panel, returned as an inline data URI. Null if the file is gone. */
async function loadLogo(): Promise<string | null> {
  try {
    const svg = await readFile(PUBLIC('everybody-eats-logo.svg'), 'utf8')
    const cream = svg.split(INK).join(CREAM)
    return `data:image/svg+xml;base64,${Buffer.from(cream).toString('base64')}`
  } catch {
    return null
  }
}

/** The OG-specific photo crop (the hero carousel's lead frame, re-encoded to
 *  JPEG — satori's WebP support is unreliable), inlined as a data URI. */
async function loadPhoto(): Promise<string | null> {
  try {
    const buf = await readFile(PUBLIC('images', 'og', 'hero.jpg'))
    return `data:image/jpeg;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

// Branded fallback social-share card. Applies to every frontend route that
// doesn't supply its own OG image, so links are never shared with a blank
// preview. Editors can override per page via the SEO image field, or set a
// global default in Site Settings → Brand → OG image.
export default async function OpengraphImage() {
  const [roman, italic, logo, photo] = await Promise.all([
    loadFont('Fraunces-OG.ttf'),
    loadFont('Fraunces-Italic-OG.ttf'),
    loadLogo(),
    loadPhoto(),
  ])

  // Render Fraunces (the brand display face) when the TTFs are present; satori
  // falls back to a serif otherwise.
  const fonts = [
    roman && { name: 'Fraunces', data: roman, weight: 400 as const, style: 'normal' as const },
    italic && { name: 'Fraunces', data: italic, weight: 400 as const, style: 'italic' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400; style: 'normal' | 'italic' }[]

  const display = fonts.length ? 'Fraunces' : 'serif'
  const PANEL = 648 // width of the forest text panel; the photo fills the rest

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: FOREST,
          color: CREAM,
          fontFamily: display,
        }}
      >
        {/* ── Left: forest text panel ─────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            width: PANEL,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 64,
            background: FOREST,
          }}
        >
          {/* warm sun glow for depth */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(560px 460px at 18% 6%, rgba(248,251,105,0.14), rgba(248,251,105,0) 62%)`,
            }}
          />

          {/* Masthead — the real wordmark */}
          <div style={{ display: 'flex', position: 'relative' }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} width={232} height={84} alt="Everybody Eats" />
            ) : (
              <div style={{ display: 'flex', fontSize: 32, letterSpacing: 0.5 }}>Everybody Eats</div>
            )}
          </div>

          {/* Headline — Fraunces with a light editorial italic emphasis. Each
              word is its own span (with a right margin for the gap) so the line
              wraps cleanly inside the panel rather than overflowing. */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              fontSize: 62,
              lineHeight: 1.06,
              position: 'relative',
            }}
          >
            {['Pay-as-you-feel', 'restaurants,', 'made', 'from'].map((w) => (
              <span key={w} style={{ marginRight: 17 }}>
                {w}
              </span>
            ))}
            <span style={{ marginRight: 17, fontStyle: 'italic', color: SUN }}>rescued</span>
            <span>food.</span>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
            <div style={{ display: 'flex', fontSize: 27, color: SUN }}>
              A New Zealand registered charity
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 20,
                letterSpacing: 0.4,
                color: 'rgba(251,247,239,0.62)',
              }}
            >
              Auckland · Wellington · everybodyeats.nz
            </div>
          </div>
        </div>

        {/* ── Right: photo, blended into the panel ────────────────────────── */}
        <div style={{ position: 'relative', display: 'flex', flexGrow: 1, height: '100%' }}>
          {photo ? (
            <img
              // eslint-disable-next-line @next/next/no-img-element
              src={photo}
              alt=""
              width={size.width - PANEL}
              height={size.height}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
          {/* Tonal forest overlay for brand cohesion + a seam gradient that melts
              the photo's left edge into the panel and darkens the foot. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, ${FOREST} 0%, rgba(29,83,55,0.0) 34%), linear-gradient(0deg, rgba(20,59,39,0.55), rgba(20,59,39,0) 42%), rgba(29,83,55,0.18)`,
            }}
          />
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) },
  )
}
