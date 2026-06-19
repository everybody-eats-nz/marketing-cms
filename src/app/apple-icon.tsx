import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Apple touch icon — a PNG so iOS home-screen bookmarks render correctly
// (iOS doesn't reliably support SVG icons). Mirrors the brand favicon mark.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1D5337',
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            border: '12px solid #FBF7EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F8FB69' }} />
        </div>
      </div>
    ),
    size,
  )
}
