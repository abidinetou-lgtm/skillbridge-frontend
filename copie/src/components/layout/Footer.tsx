import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy text-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange text-cream">
              <span className="text-lg font-black leading-none">S</span>
            </span>
            <span className="text-xl font-black tracking-tight">
              Skill<span className="text-orange">Bridge</span>
            </span>
          </div>

          <p className="text-sm text-cream/70">
            SkillBridge · HETIC Fast Tracks 2026 · Jimel · Yanis · Mahamane · Yahia
          </p>

          <div className="flex items-center gap-5 text-sm text-cream/70">
            <a href="#" className="transition-colors hover:text-orange">Mentions légales</a>
            <a href="#" className="transition-colors hover:text-orange">Confidentialité</a>
            <a href="#" className="transition-colors hover:text-orange">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
}