/**
 * Hand-drawn line-art mural of a busy Everybody Eats dining room (the Gemmayze
 * St location), drawn in the same doodle idiom as the KawakawaPattern. The asset
 * is an alpha *mask* of just the white line-work, so the line colour is whatever
 * the call site sets: we tint it via `currentColor` (`bg-current`) — cream on the
 * forest footer, forest-green on the sun donate band, etc. One asset, any panel.
 *
 * Sizing, position and opacity come from the caller's className. Drive the tint
 * (and its strength) through the text colour, e.g. `text-cream-50/[0.07]`, which
 * feeds `currentColor` through `bg-current` and out of the mask. Give the element
 * the art's aspect ratio (`aspect-[1280/759]`) so the scene isn't letterboxed.
 *
 * Decorative only: aria-hidden, no role, pointer-events-none. AVIF to match the
 * existing /patterns convention.
 */
const MASK = 'url(/patterns/dining-room.avif)'

export function DiningRoomMural({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none bg-current ${className}`}
      style={{
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
