import { useMemo } from "react";

/**
 * SkillBridge signature: décor flottant coloré présent sur toutes les pages.
 * Objets thématiques (livre, guitare, ordi...) + formes abstraites,
 * couleurs variées tirées de la palette, flottement lent.
 *
 * aria-hidden, responsive (densité plus faible en mobile), respecte
 * prefers-reduced-motion via CSS.
 */

type Variant = "hero" | "ambient" | "banner" | "dense";

interface Props {
  variant?: Variant;
  className?: string;
}

const PALETTE = [
  "var(--orange-warm)",
  "var(--learn)",
  "var(--ink)",
  "var(--peach)",
  "var(--lavender)",
  "var(--mint)",
  "var(--sky)",
  "var(--rose)",
  "var(--sun)",
];

// Each icon is rendered inside a colored circle/blob backdrop or as-is.
const ICONS = {
  book: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M10 14c8-4 18-4 22 0v36c-4-4-14-4-22 0V14Z" fill={c} />
      <path d="M54 14c-8-4-18-4-22 0v36c4-4 14-4 22 0V14Z" fill={c} opacity=".7" />
    </svg>
  ),
  guitar: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round">
      <circle cx="22" cy="44" r="14" fill={c} fillOpacity=".25" />
      <circle cx="22" cy="44" r="5" fill={c} />
      <path d="M30 36 52 14M48 10l6 6" />
    </svg>
  ),
  note: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M28 12h22v8c0 3-3 4-7 4s-7-1-7-4v22a8 8 0 1 1-8-8V12Z" fill={c} />
    </svg>
  ),
  laptop: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="10" y="14" width="44" height="28" rx="3" fill={c} fillOpacity=".3" stroke={c} strokeWidth="3" />
      <rect x="4" y="44" width="56" height="6" rx="2" fill={c} />
    </svg>
  ),
  palette: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 6C16 6 6 18 6 32s10 26 26 26c4 0 6-3 4-7-2-5 1-9 6-9h6c6 0 10-4 10-10 0-14-12-26-26-26Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="2.5"/>
      <circle cx="20" cy="24" r="3" fill="var(--orange-warm)" />
      <circle cx="32" cy="16" r="3" fill="var(--learn)" />
      <circle cx="44" cy="22" r="3" fill="var(--lavender)" />
      <circle cx="18" cy="40" r="3" fill="var(--sky)" />
    </svg>
  ),
  ball: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="24" fill={c} fillOpacity=".25" stroke={c} strokeWidth="3" />
      <path d="M32 12l8 8-3 10-10 0-3-10 8-8Z" fill={c} />
    </svg>
  ),
  camera: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="6" y="16" width="52" height="36" rx="5" fill={c} fillOpacity=".3" stroke={c} strokeWidth="3" />
      <circle cx="32" cy="34" r="10" fill={c} />
      <rect x="22" y="10" width="20" height="8" rx="2" fill={c} />
    </svg>
  ),
  rocket: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 4c10 8 14 18 14 28l-4 12H22l-4-12C18 22 22 12 32 4Z" fill={c} fillOpacity=".4" stroke={c} strokeWidth="3"/>
      <circle cx="32" cy="26" r="5" fill={c} />
      <path d="M22 44l-8 14 12-4M42 44l8 14-12-4" fill={c} />
    </svg>
  ),
  bulb: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M22 42c-6-4-10-10-10-18a20 20 0 0 1 40 0c0 8-4 14-10 18v6H22v-6Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="3"/>
      <rect x="24" y="52" width="16" height="6" rx="2" fill={c} />
    </svg>
  ),
  gear: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 4l4 6 7-2 1 7 7 1-2 7 6 4-6 4 2 7-7 1-1 7-7-2-4 6-4-6-7 2-1-7-7-1 2-7-6-4 6-4-2-7 7-1 1-7 7 2 4-6Z" fill={c} fillOpacity=".3" stroke={c} strokeWidth="2.5"/>
      <circle cx="32" cy="32" r="8" fill={c} />
    </svg>
  ),
  beaker: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M22 6h20v14l12 28a6 6 0 0 1-6 8H16a6 6 0 0 1-6-8l12-28V6Z" fill={c} fillOpacity=".3" stroke={c} strokeWidth="3"/>
      <circle cx="26" cy="40" r="3" fill={c} />
      <circle cx="36" cy="46" r="2" fill={c} />
    </svg>
  ),
  pencil: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M44 6l14 14L24 54l-18 4 4-18L44 6Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="3"/>
      <path d="M40 10l14 14" stroke={c} strokeWidth="3"/>
    </svg>
  ),
  headphones: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M8 36a24 24 0 0 1 48 0" stroke={c} strokeWidth="4" fill="none"/>
      <rect x="6" y="34" width="14" height="22" rx="4" fill={c} />
      <rect x="44" y="34" width="14" height="22" rx="4" fill={c} />
    </svg>
  ),
  cake: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="8" y="28" width="48" height="26" rx="4" fill={c} fillOpacity=".4" stroke={c} strokeWidth="3"/>
      <path d="M8 38c8 6 16-6 24 0s16-6 24 0" stroke={c} strokeWidth="3" fill="none"/>
      <path d="M32 12v12M24 18v6M40 18v6" stroke={c} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  boat: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M4 44h56l-6 12H10L4 44Z" fill={c} />
      <path d="M32 6v34M32 8l18 32H32V8Z" fill={c} fillOpacity=".4" stroke={c} strokeWidth="3"/>
    </svg>
  ),
  pad: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M16 20h32a10 10 0 0 1 10 10v4a10 10 0 0 1-18 6l-4-4h-8l-4 4a10 10 0 0 1-18-6v-4a10 10 0 0 1 10-10Z" fill={c} fillOpacity=".35" stroke={c} strokeWidth="3"/>
      <circle cx="22" cy="32" r="3" fill={c} />
      <circle cx="44" cy="30" r="3" fill={c} />
      <circle cx="44" cy="36" r="3" fill={c} />
    </svg>
  ),
  blob: (c: string) => (
    <svg viewBox="0 0 100 100">
      <path d="M50 8c20 0 38 12 40 32s-12 38-32 44-44-6-48-26S30 8 50 8Z" fill={c} fillOpacity=".5" />
    </svg>
  ),
  ring: (c: string) => (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="24" stroke={c} strokeWidth="5" />
    </svg>
  ),
  star: (c: string) => (
    <svg viewBox="0 0 64 64">
      <path d="M32 6l8 18 20 2-15 14 5 20-18-11-18 11 5-20-15-14 20-2 8-18Z" fill={c} />
    </svg>
  ),
  triangle: (c: string) => (
    <svg viewBox="0 0 64 64">
      <path d="M32 8l26 46H6L32 8Z" fill={c} fillOpacity=".6" rx="10" />
    </svg>
  ),
};

type IconKey = keyof typeof ICONS;

interface Item {
  key: IconKey;
  top: string;
  left: string;
  size: number;
  rot: number;
  dur: number;
  delay: number;
  color: string;
  alt: boolean;
  opacity: number;
  hideMobile?: boolean;
}

function makeItems(variant: Variant): Item[] {
  const all: IconKey[] = [
    "book", "guitar", "note", "laptop", "palette", "ball",
    "camera", "rocket", "bulb", "gear", "beaker", "pencil",
    "headphones", "cake", "boat", "pad", "blob", "ring", "star", "triangle",
  ];

  // base count
  const count = variant === "hero" ? 18 : variant === "dense" ? 16 : variant === "banner" ? 10 : 11;

  // Deterministic-ish pseudo-random spread
  const rand = (s: number) => {
    const x = Math.sin(s * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = rand(i + 1);
    const r2 = rand(i + 11);
    const r3 = rand(i + 23);
    const r4 = rand(i + 37);
    const r5 = rand(i + 51);
    const key = all[Math.floor(r1 * all.length)];
    const size = 38 + Math.floor(r2 * 70);
    const top = `${Math.floor(r3 * 92)}%`;
    const left = `${Math.floor(r4 * 94)}%`;
    const rot = Math.floor((r5 - 0.5) * 60);
    const dur = 7 + r1 * 8;
    const delay = -r2 * 8;
    const color = PALETTE[Math.floor(r5 * PALETTE.length)];
    const alt = r3 > 0.5;
    const baseOpacity = variant === "ambient" ? 0.32 : variant === "banner" ? 0.55 : 0.55;
    const opacity = baseOpacity + r2 * 0.15;
    items.push({
      key, top, left, size, rot, dur, delay, color, alt, opacity,
      hideMobile: i % 2 === 1, // halve density on mobile
    });
  }
  return items;
}

export default function FloatingDecor({ variant = "ambient", className = "" }: Props) {
  const items = useMemo(() => makeItems(variant), [variant]);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`floating-item absolute ${it.alt ? "alt" : ""} ${it.hideMobile ? "hidden md:block" : ""}`}
          style={{
            top: it.top,
            left: it.left,
            width: it.size,
            height: it.size,
            opacity: it.opacity,
            // CSS custom props consumed by keyframes
            ["--rot" as string]: `${it.rot}deg`,
            ["--dur" as string]: `${it.dur}s`,
            ["--delay" as string]: `${it.delay}s`,
            transform: `rotate(${it.rot}deg)`,
          }}
        >
          {ICONS[it.key](it.color)}
        </div>
      ))}
    </div>
  );
}
