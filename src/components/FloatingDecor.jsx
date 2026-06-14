import { useMemo } from 'react'

const PALETTE = [
  'var(--orange-warm)', 'var(--learn)', 'var(--ink)',
  'var(--peach)', 'var(--lavender)', 'var(--mint)',
  'var(--sky)', 'var(--rose)', 'var(--sun)',
]

const ICONS = {
  book: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M10 14c8-4 18-4 22 0v36c-4-4-14-4-22 0V14Z" fill={c} />
      <path d="M54 14c-8-4-18-4-22 0v36c4-4 14-4 22 0V14Z" fill={c} opacity=".7" />
    </svg>
  ),
  guitar: (c) => (
    <svg viewBox="0 0 64 64" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round">
      <circle cx="22" cy="44" r="14" fill={c} fillOpacity=".25" />
      <circle cx="22" cy="44" r="5" fill={c} />
      <path d="M30 36 52 14M48 10l6 6" />
    </svg>
  ),
  note: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M28 12h22v8c0 3-3 4-7 4s-7-1-7-4v22a8 8 0 1 1-8-8V12Z" fill={c} />
    </svg>
  ),
  laptop: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="10" y="14" width="44" height="28" rx="3" fill={c} fillOpacity=".3" stroke={c} strokeWidth="3" />
      <rect x="4" y="44" width="56" height="6" rx="2" fill={c} />
    </svg>
  ),
  palette: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 6C16 6 6 18 6 32s10 26 26 26c4 0 6-3 4-7-2-5 1-9 6-9h6c6 0 10-4 10-10 0-14-12-26-26-26Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="2.5"/>
      <circle cx="20" cy="24" r="3" fill="var(--orange-warm)" />
      <circle cx="32" cy="16" r="3" fill="var(--learn)" />
      <circle cx="44" cy="22" r="3" fill="var(--lavender)" />
    </svg>
  ),
  rocket: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 4c10 8 14 18 14 28l-4 12H22l-4-12C18 22 22 12 32 4Z" fill={c} fillOpacity=".4" stroke={c} strokeWidth="3"/>
      <circle cx="32" cy="26" r="5" fill={c} />
    </svg>
  ),
  bulb: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M22 42c-6-4-10-10-10-18a20 20 0 0 1 40 0c0 8-4 14-10 18v6H22v-6Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="3"/>
      <rect x="24" y="52" width="16" height="6" rx="2" fill={c} />
    </svg>
  ),
  pencil: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M44 6l14 14L24 54l-18 4 4-18L44 6Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="3"/>
    </svg>
  ),
  ring: (c) => (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="24" stroke={c} strokeWidth="5" />
    </svg>
  ),
  star: (c) => (
    <svg viewBox="0 0 64 64">
      <path d="M32 6l8 18 20 2-15 14 5 20-18-11-18 11 5-20-15-14 20-2 8-18Z" fill={c} />
    </svg>
  ),
  triangle: (c) => (
    <svg viewBox="0 0 64 64">
      <path d="M32 8l26 46H6L32 8Z" fill={c} fillOpacity=".6" />
    </svg>
  ),
  blob: (c) => (
    <svg viewBox="0 0 100 100">
      <path d="M50 8c20 0 38 12 40 32s-12 38-32 44-44-6-48-26S30 8 50 8Z" fill={c} fillOpacity=".5" />
    </svg>
  ),
}

const ICON_KEYS = Object.keys(ICONS)

function rand(s) {
  const x = Math.sin(s * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function makeItems(variant) {
  const count = variant === 'hero' ? 16 : variant === 'dense' ? 14 : variant === 'banner' ? 9 : 10
  const items = []
  for (let i = 0; i < count; i++) {
    const r1 = rand(i + 1), r2 = rand(i + 11), r3 = rand(i + 23), r4 = rand(i + 37), r5 = rand(i + 51)
    const key = ICON_KEYS[Math.floor(r1 * ICON_KEYS.length)]
    const size = 36 + Math.floor(r2 * 60)
    const top  = `${Math.floor(r3 * 92)}%`
    const left = `${Math.floor(r4 * 94)}%`
    const rot  = Math.floor((r5 - 0.5) * 60)
    const dur  = 7 + r1 * 8
    const delay = -r2 * 8
    const color = PALETTE[Math.floor(r5 * PALETTE.length)]
    const alt   = r3 > 0.5
    const baseOpacity = variant === 'ambient' ? 0.28 : 0.5
    const opacity = baseOpacity + r2 * 0.14
    items.push({ key, top, left, size, rot, dur, delay, color, alt, opacity, hideMobile: i % 2 === 1 })
  }
  return items
}

export default function FloatingDecor({ variant = 'ambient' }) {
  const items = useMemo(() => makeItems(variant), [variant])
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`floating-item absolute ${it.alt ? 'alt' : ''} ${it.hideMobile ? 'hidden md:block' : ''}`}
          style={{
            top: it.top, left: it.left, width: it.size, height: it.size,
            opacity: it.opacity,
            '--rot': `${it.rot}deg`,
            '--dur': `${it.dur}s`,
            '--delay': `${it.delay}s`,
            transform: `rotate(${it.rot}deg)`,
          }}
        >
          {ICONS[it.key](it.color)}
        </div>
      ))}
    </div>
  )
}
