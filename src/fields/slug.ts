import type { Field, FieldHook } from 'payload'

// Combining diacritical marks (U+0300–U+036F). NFKD splits an accented letter
// into base + these marks; stripping them leaves the plain base letter.
const COMBINING_MARKS = /[\u0300-\u036f]/g

/**
 * Normalise an arbitrary string into a URL-safe slug: lowercase, accents
 * stripped, every run of non-alphanumeric characters collapsed to a single
 * hyphen, and leading/trailing hyphens trimmed.
 *
 * Pass `allowSlashes` for path-style slugs (Pages use nested paths like
 * `about/team`) — each `/`-separated segment is slugified independently and
 * empty segments are dropped, so `/About/Our Team/` → `about/our-team`.
 */
export function slugify(input: string, opts: { allowSlashes?: boolean } = {}): string {
  const normalised = input.normalize('NFKD').replace(COMBINING_MARKS, '').toLowerCase().trim()

  const segment = (s: string) => s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  if (opts.allowSlashes) {
    return normalised.split('/').map(segment).filter(Boolean).join('/')
  }
  return segment(normalised)
}

/**
 * `beforeValidate` hook that keeps the slug clean: any hand-typed value is
 * normalised through {@link slugify}, and when the field is left blank it is
 * derived from the sibling `from` field (e.g. `name` or `title`). This makes
 * malformed slugs like `Dilly Dally - Guest Chef` structurally impossible.
 */
const formatSlug =
  (from: string | undefined, allowSlashes: boolean): FieldHook =>
  ({ value, siblingData, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) {
      return slugify(value, { allowSlashes })
    }
    const source = from ? (siblingData?.[from] ?? originalDoc?.[from]) : undefined
    if (typeof source === 'string' && source.trim()) {
      return slugify(source, { allowSlashes })
    }
    return value
  }

type SlugFieldOptions = {
  /** Sibling field to derive the slug from when it's left blank (e.g. `name`). */
  from?: string
  /** Preserve `/` path separators — for nested Page slugs. */
  allowSlashes?: boolean
  /** Admin help text. */
  description?: string
}

/**
 * A reusable, self-normalising `slug` text field. Drop-in replacement for the
 * hand-rolled `{ name: 'slug', type: 'text', required, unique, index }` blocks.
 */
export function slugField(options: SlugFieldOptions = {}): Field {
  const { from, allowSlashes = false, description } = options
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    ...(description ? { admin: { description } } : {}),
    hooks: {
      beforeValidate: [formatSlug(from, allowSlashes)],
    },
  }
}
