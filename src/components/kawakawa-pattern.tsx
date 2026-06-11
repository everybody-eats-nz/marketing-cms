/**
 * Decorative hand-drawn food doodle band from the original Webflow site
 * ("HeaderBG Kawakawa"): forest-green plates, bowls and bread with sun-yellow
 * accents on a transparent background. The old site pinned it to the top-right
 * of its dark kale headers; we use it the same way as a corner accent on
 * forest/sun panels. Position, width and opacity are supplied per call site.
 *
 * Plain <img> on purpose: the asset is a pre-optimised AVIF served from
 * /public, and it's purely decorative (empty alt, aria-hidden).
 *
 * Anchor it to a panel's TOP edge: the band is drawn with its doodles sliced
 * mid-shape along the top of the image, so bottom-anchoring exposes that cut
 * as a hard horizontal line.
 */
export function KawakawaPattern({ className = '' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/patterns/kawakawa.avif"
      alt=""
      aria-hidden
      loading="lazy"
      className={`absolute pointer-events-none select-none max-w-none ${className}`}
    />
  )
}
