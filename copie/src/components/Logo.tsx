export default function Logo({ light = false }: { light?: boolean }) {
  const fg = light ? "#fff" : "var(--ink)";
  return (
    <div className="flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
        <circle cx="14" cy="24" r="9" fill="var(--orange-warm)" />
        <circle cx="34" cy="24" r="9" fill="var(--learn)" />
        <rect x="14" y="21" width="20" height="6" fill="var(--ink)" rx="2" />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight" style={{ color: fg }}>
        SkillBridge
      </span>
    </div>
  );
}
