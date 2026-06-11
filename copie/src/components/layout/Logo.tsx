import { Link, useRouterState } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-cream shadow-sm">
        <span className="text-lg font-black leading-none">S</span>
      </span>
      <span className="text-xl font-black tracking-tight text-navy">
        Skill<span className="text-orange">Bridge</span>
      </span>
    </Link>
  );
}

export { useRouterState, Link };
