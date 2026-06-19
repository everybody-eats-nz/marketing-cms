import { ImageResponse } from 'next/og'

export const alt = 'Everybody Eats — pay-as-you-feel restaurants in Aotearoa'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded fallback social-share card. Applies to every frontend route that
// doesn't supply its own OG image, so links are never shared with a blank
// preview. Editors can override per page via the SEO image field, or set a
// global default in Site Settings → Brand → OG image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1D5337',
          padding: '72px 80px',
          color: '#FBF7EF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '7px solid #FBF7EF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F8FB69' }} />
          </div>
          <div style={{ fontSize: 30, letterSpacing: 1, opacity: 0.9 }}>Everybody Eats</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, lineHeight: 1.04, fontWeight: 600, maxWidth: 900 }}>
            Pay-as-you-feel restaurants, made from rescued food.
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: '#F8FB69' }}>
            A New Zealand registered charity
          </div>
        </div>
      </div>
    ),
    size,
  )
}
