import {
  Code2, Atom, GitBranch, Boxes, Database, Globe, Sigma, Activity,
  Network, ShieldCheck, Languages, Palette, BarChart3, FlaskConical,
} from 'lucide-react'

const MAP = {
  React:              { icon: Atom,         bg: 'var(--sky)',      fg: 'var(--ink)' },
  Python:             { icon: Code2,        bg: 'var(--sun)',      fg: 'var(--ink)' },
  Git:                { icon: GitBranch,    bg: 'var(--peach)',    fg: 'var(--ink)' },
  Docker:             { icon: Boxes,        bg: 'var(--sky)',      fg: 'var(--ink)' },
  TypeScript:         { icon: Code2,        bg: 'var(--sky)',      fg: 'var(--ink)' },
  'Node.js':          { icon: Code2,        bg: 'var(--mint)',     fg: 'var(--ink)' },
  Maths:              { icon: Sigma,        bg: 'var(--lavender)', fg: 'var(--ink)' },
  Physique:           { icon: Activity,     bg: 'var(--rose)',     fg: 'var(--ink)' },
  Réseau:             { icon: Network,      bg: 'var(--mint)',     fg: 'var(--ink)' },
  Cybersécurité:      { icon: ShieldCheck,  bg: 'var(--ink)',      fg: '#fff'       },
  Anglais:            { icon: Languages,    bg: 'var(--peach)',    fg: 'var(--ink)' },
  'Base de données':  { icon: Database,     bg: 'var(--lavender)', fg: 'var(--ink)' },
  'Design UI':        { icon: Palette,      bg: 'var(--rose)',     fg: 'var(--ink)' },
  'Data Science':     { icon: BarChart3,    bg: 'var(--sun)',      fg: 'var(--ink)' },
  Chimie:             { icon: FlaskConical, bg: 'var(--mint)',     fg: 'var(--ink)' },
  Espagnol:           { icon: Globe,        bg: 'var(--peach)',    fg: 'var(--ink)' },
}

export default function TechIcon({ name, size = 56 }) {
  const entry = MAP[name] ?? { icon: Code2, bg: 'var(--peach)', fg: 'var(--ink)' }
  const Ico = entry.icon
  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{ width: size, height: size, background: entry.bg, color: entry.fg }}
    >
      <Ico className="h-7 w-7" />
    </div>
  )
}
