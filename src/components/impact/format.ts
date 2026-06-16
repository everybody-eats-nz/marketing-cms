/** Shared NZ number/money formatting for the impact story. */
export const fmt = (n: number) => n.toLocaleString('en-NZ')
export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-NZ')
/** Compact money for axis ticks etc. — $1.7M, $377k. */
export const moneyShort = (n: number) => {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + 'M'
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'k'
  return '$' + Math.round(n)
}
export const dollars = (n: number | null) => (n == null ? '—' : '$' + n.toFixed(2))
