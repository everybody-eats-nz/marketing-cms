# Style guide — Everybody Eats marketing site

The canonical reference for the brand system. Pair with the live page at [`/styleguide`](src/app/(frontend)/styleguide/page.tsx) — that's where the tokens actually render. This file is for agents and humans building or reviewing UI work.

If you're adding a block, opening a PR, or auditing an existing page, the system here is what you're conforming to. When the live page and this file disagree, the live page wins — update this file to match.

---

## Tokens

The colour palette and editorial scales live in one dependency-free module, [src/styles/brand-tokens.ts](src/styles/brand-tokens.ts), which is imported by **both** [tailwind.config.ts](tailwind.config.ts) (to build the theme) and the live [`/styleguide`](src/app/(frontend)/styleguide/page.tsx) page (so the reference can never drift from what Tailwind emits). Theme-aware CSS variables and component utilities live in [src/app/(frontend)/globals.css](src/app/(frontend)/globals.css). Never invent a new colour, font size, or radius in component code — change `brand-tokens.ts` (or extend the config) instead.

The `/styleguide` page is interactive: click any token/class chip to copy it, toggle Light/Dark to preview semantic tokens, and use the built-in contrast checker and type playground before introducing a new pairing.

### Colour palette

| Family   | Token range          | Role                                                                            |
| -------- | -------------------- | ------------------------------------------------------------------------------- |
| `cream`  | 50 → 300             | Paper surfaces. `cream-50` is the page background.                              |
| `forest` | 50 → 900             | Brand primary. `forest-500` for actions, `forest-700` for dark panels and text. |
| `sun`    | 50 → 400             | Accent only — buttons, highlights, CTA panels. `sun-200` is the workhorse.      |
| `clay`   | 100 → 300            | Tertiary warmth. Use sparingly.                                                 |
| `ink`    | (single, `#1A1410`)  | Reserve for max-contrast text. Most copy uses `forest-700`.                     |

**Common pairings**

- Light surface: `bg-cream-50` + `text-forest-700` (page default, set in `globals.css`)
- Soft panel: `bg-cream-100` + `text-forest-700` + `border-forest-500/10`
- Dark panel: `bg-forest-700` + `text-cream-50` (often with a blurred `sun-200/15` glow)
- Accent panel: `bg-sun-200` + `text-forest-700`
- Hairline divider: `border-forest-500/10` (5–15% tints with `/n` opacity)

### Typography

| Font                              | Variable          | Used for                              |
| --------------------------------- | ----------------- | ------------------------------------- |
| Fraunces (variable, SOFT + WONK)  | `--font-fraunces` | Display headings (`display` / `font-display`) |
| Plus Jakarta Sans                 | `--font-jakarta`  | Body, navigation, buttons (default `font-sans`) |
| JetBrains Mono                    | `--font-mono`     | Eyebrows that need numerals, code, micro-meta  |

**Display rules**

- Headings get the `display` class (or `font-display`) for kerning + ligatures + `ss01`.
- Wrap a word in `<em>` to switch into the editorial soft-wonk italic. In CMS textareas, `*asterisks*` are converted to `<em>` by [render-text.tsx](src/components/blocks/render-text.tsx).
- Hero size is `text-7xl` (or `text-8xl` rarely) at `font-light` with `leading-[0.95]`.
- Section headings are typically `text-4xl sm:text-6xl font-light`.
- Body copy default opacity is ~85% (`text-forest-700/85`) for long-form readability.

**Eyebrow / kicker**

- Use the `eyebrow` class — `0.65rem`, uppercase, `0.18em` tracking, `forest-500/80`.
- Often paired with an 8px hairline rule:
  ```tsx
  <p className="eyebrow flex items-center gap-3">
    <span className="inline-block w-8 h-px bg-forest-500/50" />
    Section kicker
  </p>
  ```

### Spacing & containers

- `container-wide` — `max-w-[88rem]`, the default page wrapper.
- `container-tight` — `max-w-5xl`, long-form / article content.
- Section vertical rhythm: `py-20 sm:py-24` for standard sections, `py-24 sm:py-32` for panels.
- Inside panels: `p-10 sm:p-16`, corners `rounded-3xl` or `rounded-[3rem]`.

### Motion

| Class / utility       | Behaviour                                                |
| --------------------- | -------------------------------------------------------- |
| `card-hover`          | 300ms ease, `-translate-y-1`, `shadow-xl` — used by cards |
| `animate-fade-up`     | 0.8s entrance, opacity + 20px slide                       |
| `marquee-track`       | 35s infinite loop, pauses on hover                        |
| `ease-in-out-soft`    | Default easing for transitions                            |
| `ease-expressive`     | Cubic overshoot for delight moments                       |

Honour `prefers-reduced-motion` — it's wired up in `globals.css`. Never put information in motion alone.

---

## Components

### Buttons

Three pre-built button classes live in `globals.css`. Stick to them.

| Class         | When                                                                |
| ------------- | ------------------------------------------------------------------- |
| `btn-primary` | The default action — forest fill, lifts on hover.                   |
| `btn-accent`  | Marketing CTAs on light or dark backgrounds — sun-yellow.           |
| `btn-ghost`   | Secondary actions — outline that fills on hover.                    |

On a `bg-forest-*` panel, prefer `btn-accent` for the primary or invert the ghost borders manually (`border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-forest-700`).

For inline "next" links use the arrow-gap pattern:

```tsx
<a className="group inline-flex items-center gap-2 text-sm font-medium text-forest-500 hover:gap-3 transition-all">
  Read the story <span>→</span>
</a>
```

### Cards

- Soft fill (`bg-cream-100` on light pages, `bg-forest-700` inside dark panels).
- Corners `rounded-3xl`, optional border `border-forest-500/10`.
- Add `card-hover` for interactive cards.
- Use a numbered eyebrow (e.g. `01`, `02`) in `font-mono text-xs tracking-[0.2em] text-forest-500/70` — see [pillars-block.tsx](src/components/blocks/pillars-block.tsx).

### Forms

The newsletter pattern is the canonical input style: pill-shaped, transparent input inside a coloured wrapper.

```tsx
<form className="flex items-center gap-2 bg-cream-100 rounded-pill p-1.5 border border-forest-500/10">
  <input type="email" className="flex-1 bg-transparent px-5 py-2 text-sm placeholder:text-forest-600/40 text-forest-700 focus:outline-none" />
  <button className="btn-primary text-xs px-5 py-2">Sign up</button>
</form>
```

On dark: swap to `bg-forest-600` wrapper, `text-cream-50`, `placeholder:text-cream-50/40`, and the accent button.

### Brand details

- **Sun highlight** — the signature hero treatment. A marker-style sun-200 highlight sits behind the lower half of a single keyword. On dark pages it fills the whole word and the keyword text goes forest-700 so it stays legible on the yellow. Wired through the `highlightWord` field in [hero-block.tsx](src/components/blocks/hero-block.tsx).
- **Sun sticker** — rotated yellow disc overlapping hero imagery, also in `hero-block.tsx`.
- **Grain** — apply the `grain` utility for the inline-SVG paper texture (5% multiply). Used on hero sections and most panels.
- **Forest glow** — pair dark panels with `<div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl" aria-hidden />` for the signature warm glow.

---

## Section patterns

Almost every section sits on one of three surfaces. Pick by mood:

- **Light (default)** — informational sections, lists, FAQs. `bg-cream-50` page + cream/forest cards.
- **Sun panel** — joyful CTAs and quotes. `bg-sun-200` + forest text. See [cta-strip-block.tsx](src/components/blocks/cta-strip-block.tsx).
- **Forest panel** — statement headlines, big numbers, sometimes pillars. `bg-forest-700` + cream text + sun-glow.

Wrap panels in `rounded-[3rem]` and add `grain` for texture. Common scaffold:

```tsx
<section className="container-wide py-24">
  <div className="bg-forest-700 grain rounded-[3rem] text-cream-50 px-8 sm:px-16 py-20 relative overflow-hidden">
    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sun-200/15 blur-3xl" aria-hidden />
    {/* content */}
  </div>
</section>
```

---

## Working in the blocks pipeline

When you add a new visual section, it almost always belongs as a block, not a bespoke page. Follow the three-touchpoint pattern documented in [CLAUDE.md](CLAUDE.md):

1. **Config** — add a `Block` definition in `src/blocks/<name>.ts`.
2. **Renderer** — add the matching component in `src/components/blocks/<name>-block.tsx`.
3. **Register** — add it to `src/collections/Pages.ts` (`layout.blocks`) **and** the switch in [render-blocks.tsx](src/components/blocks/render-blocks.tsx).

Forgetting either side silently breaks the block (admin can add it but nothing renders, or vice-versa). Then run `pnpm generate:types`.

### Inside a new block

- Use the utility classes documented above — never raw hex.
- Prefer `<PayloadImage>` over `next/image` for any CMS image — it picks the right Sharp size automatically.
- Resolve CMS links through `resolveHref()` from [src/lib/types.ts](src/lib/types.ts).
- Pipe textareas through `renderRichText()` / `renderRichInline()` so `*emphasis*` markers turn into the soft-wonk italic.
- Server components by default. Only add `'use client'` for interactivity, and keep the client component in its own file.

---

## Quick rules of thumb

- Headings: `display`, `font-light`, tight leading, generous size.
- Wrap one word per heading in `<em>` (or `*asterisks*`) for the brand italic.
- Default text colour is `forest-700` (full) for headings / `forest-700/85` for body.
- Buttons are pill-shaped (`rounded-pill`) with a subtle hover lift.
- Cards round at `3xl`; panels round at `[3rem]`.
- Hairlines are `forest-500/10` (or any `forest-500/<n>` tint).
- Sun is for accent only — never the primary action surface.
- Add `grain` to anything that should feel like paper.
- Honour reduced motion — it's already wired up globally.

When in doubt, open [`/styleguide`](src/app/(frontend)/styleguide/page.tsx) in the browser. If a pattern isn't shown there, it probably isn't part of the system yet — propose it before introducing it.
