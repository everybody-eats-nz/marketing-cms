import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
// Brand palette + editorial scales live in one dependency-free module so the
// live /styleguide page renders from the exact same source Tailwind compiles
// from. See src/styles/brand-tokens.ts.
import { colors, fontSize, borderRadius } from './src/styles/brand-tokens'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,mdx,js,jsx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize,
      borderRadius,
      backgroundImage: {
        'grain': "url('/grain.svg')",
        'noise': "url('/noise.png')",
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'fade-up': 'fade-up 0.8s ease-out both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'in-out-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'expressive': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [typography],
}

export default config
