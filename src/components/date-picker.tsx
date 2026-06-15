'use client'

import { useEffect, useRef, useState } from 'react'

type Tone = 'forest' | 'cream'

type Props = {
  name: string
  id?: string
  tone: Tone
  /** Same classes the sibling inputs use, so the trigger matches them. */
  fieldClassName: string
  placeholder?: string
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const parseISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const formatDisplay = (iso: string) =>
  parseISO(iso).toLocaleDateString('en-NZ', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

export function DatePicker({ name, id, tone, fieldClassName, placeholder = 'Select a date' }: Props) {
  const isForest = tone === 'forest'
  const today = startOfDay(new Date())
  const currentMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1)

  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(currentMonthFirst)
  const [focused, setFocused] = useState<Date>(today)
  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Keep DOM focus on the focused day for keyboard navigation.
  useEffect(() => {
    if (!open) return
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toISO(focused)}"]`)?.focus()
  }, [open, focused])

  const openPicker = () => {
    const base = value ? parseISO(value) : today
    const start = base < today ? today : base
    setView(new Date(start.getFullYear(), start.getMonth(), 1))
    setFocused(start)
    setOpen(true)
  }

  const select = (d: Date) => {
    if (d < today) return
    setValue(toISO(d))
    setOpen(false)
  }

  const moveFocus = (deltaDays: number) => {
    const next = startOfDay(
      new Date(focused.getFullYear(), focused.getMonth(), focused.getDate() + deltaDays),
    )
    if (next < today) return
    setFocused(next)
    if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
      setView(new Date(next.getFullYear(), next.getMonth(), 1))
    }
  }

  const onGridKey = (e: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
    }
    if (e.key in moves) {
      e.preventDefault()
      moveFocus(moves[e.key])
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(focused)
    }
  }

  const canPrev = view > currentMonthFirst
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const startOffset = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7

  const panelCls = isForest
    ? 'bg-forest-700 border-cream-50/15 text-cream-50'
    : 'bg-cream-50 border-forest-500/15 text-forest-700 dark:bg-surface dark:border-line/20 dark:text-content'
  const navCls = `flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${
    isForest ? 'hover:bg-forest-600' : 'hover:bg-forest-500/10 dark:hover:bg-line/10'
  }`
  const placeholderText = isForest ? 'text-cream-50/40' : 'text-forest-600/40 dark:text-muted/50'

  const dayCls = (disabled: boolean, selected: boolean, isToday: boolean) => {
    const base =
      'flex h-9 items-center justify-center rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ' +
      (isForest ? 'focus:ring-sun-200/60' : 'focus:ring-forest-500/40')
    if (disabled) return `${base} opacity-25 cursor-not-allowed`
    if (selected)
      return `${base} font-semibold ${isForest ? 'bg-sun-200 text-forest-700' : 'bg-forest-500 text-cream-50'}`
    const hover = isForest
      ? 'text-cream-50 hover:bg-forest-600'
      : 'text-forest-700 hover:bg-forest-500/10 dark:text-content dark:hover:bg-line/10'
    const ring = isToday
      ? isForest ? ' ring-1 ring-inset ring-sun-200/50' : ' ring-1 ring-inset ring-forest-500/40'
      : ''
    return `${base} ${hover}${ring}`
  }

  return (
    <div className="relative" ref={wrapRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${fieldClassName} flex items-center justify-between gap-2 text-left ${value ? '' : placeholderText}`}
      >
        <span>{value ? formatDisplay(value) : placeholder}</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 opacity-70" aria-hidden>
          <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9h18M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className={`absolute left-0 top-full z-30 mt-2 w-[19rem] rounded-2xl border p-3 shadow-xl ${panelCls}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className={navCls}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="text-sm font-medium">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className={navCls}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1 text-center text-[0.65rem] uppercase tracking-wide opacity-55">
                {w}
              </div>
            ))}
          </div>

          <div ref={gridRef} role="grid" onKeyDown={onGridKey} className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`pad-${i}`} aria-hidden />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = startOfDay(new Date(view.getFullYear(), view.getMonth(), i + 1))
              const iso = toISO(d)
              const disabled = d < today
              const selected = value === iso
              const isToday = +d === +today
              return (
                <button
                  key={iso}
                  type="button"
                  data-date={iso}
                  disabled={disabled}
                  tabIndex={iso === toISO(focused) ? 0 : -1}
                  onClick={() => select(d)}
                  aria-pressed={selected}
                  aria-label={d.toLocaleDateString('en-NZ', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                  className={dayCls(disabled, selected, isToday)}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
