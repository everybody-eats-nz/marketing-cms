// Single source of truth for the brand palette + editorial scales.
//
// Imported by BOTH tailwind.config.ts (to build the Tailwind theme) AND the
// live /styleguide page (so the reference can never drift from what Tailwind
// actually emits). Change a value here once and both the utility classes and
// the style guide update together.
//
// Keep this file dependency-free (plain data only) so it's safe to import into
// client components.

// Theme-aware semantic tokens are CSS-variable backed (see globals.css) so
// opacity modifiers like `text-content/70` still work and they flip between
// light/dark via the `.dark` class. The literal brand ramps below stay fixed.
export const colors = {
  surface: 'rgb(var(--surface) / <alpha-value>)',
  'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
  'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
  content: 'rgb(var(--content) / <alpha-value>)',
  muted: 'rgb(var(--muted) / <alpha-value>)',
  line: 'rgb(var(--line) / <alpha-value>)',
  // Off-white "paper" backgrounds
  cream: {
    50: '#FDF8EF',
    100: '#FAF2E4',
    200: '#F5E9D2',
    300: '#EDDDB7',
  },
  // Brand forest green
  forest: {
    50: '#EEF4EF',
    100: '#D4E3D6',
    200: '#9BBDA0',
    300: '#5A8B62',
    400: '#2E6438',
    500: '#1D5337', // brand primary
    600: '#163F2A',
    700: '#0E2A1C',
    800: '#091A11',
    900: '#040A07',
  },
  // Bright sunshine yellow
  sun: {
    50: '#FEFFE8',
    100: '#FBFCB8',
    200: '#F8FB69', // brand accent
    300: '#EDF03F',
    400: '#D3D622',
  },
  // Warm coral / clay for tertiary accents
  clay: {
    100: '#F4D2BE',
    200: '#E8A988',
    300: '#D87F58',
  },
  ink: '#1A1410',
}

// Editorial type scale. Each entry is [size, { lineHeight, letterSpacing? }] —
// the shape Tailwind's fontSize option expects.
type FontSizeValue = [string, { lineHeight: string; letterSpacing?: string }]
export const fontSize: Record<string, FontSizeValue> = {
  xs: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
  sm: ['0.875rem', { lineHeight: '1.5' }],
  base: ['1rem', { lineHeight: '1.625' }],
  lg: ['1.125rem', { lineHeight: '1.6' }],
  xl: ['1.25rem', { lineHeight: '1.55' }],
  '2xl': ['1.5rem', { lineHeight: '1.4' }],
  '3xl': ['1.875rem', { lineHeight: '1.25' }],
  '4xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  '5xl': ['3.5rem', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
  '6xl': ['4.75rem', { lineHeight: '0.96', letterSpacing: '-0.03em' }],
  '7xl': ['6rem', { lineHeight: '0.94', letterSpacing: '-0.035em' }],
  '8xl': ['7.5rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
}

export const borderRadius = {
  '4xl': '2rem',
  '5xl': '2.5rem',
  pill: '999px',
}
