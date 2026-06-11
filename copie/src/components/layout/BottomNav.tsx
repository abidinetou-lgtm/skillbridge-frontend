import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, Video, MessageCircle, User } from "lucide-react";

const items = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/connections", label: "Connexions", icon: Users },
  { to: "/sessions", label: "Sessions", icon: Video },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-light-cream/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
            >
              <Icon className={`h-5 w-5 ${active ? "text-orange" : "text-foreground/55"}`} />
              <span className={`text-[10px] font-medium ${active ? "text-navy" : "text-foreground/55"}`}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
