import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, LogOut, Coins } from "lucide-react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/connections", label: "Connexions" },
  { to: "/sessions", label: "Sessions" },
  { to: "/chat", label: "Messages" },
  { to: "/credits", label: "Crédits" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-light-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-navy text-cream" : "text-foreground/70 hover:bg-cream hover:text-navy"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/credits"
            className="inline-flex items-center gap-1.5 rounded-full bg-sage/10 px-3 py-1.5 text-sm font-semibold text-sage"
          >
            <Coins className="h-4 w-4" /> 240
          </Link>
          <Link to="/profile">
            <Avatar className="h-9 w-9 border-2 border-orange">
              <AvatarFallback className="bg-navy text-xs font-bold text-cream">JM</AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Se déconnecter">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="min-h-[44px] min-w-[44px]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-light-cream">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-2 mb-6">
                <Logo />
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 text-base font-semibold ${
                      pathname === l.to ? "bg-navy text-cream" : "text-foreground hover:bg-cream"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-cream"
                >
                  Mon profil
                </Link>
              </nav>
              <Button variant="heroOutline" className="mt-6 w-full">
                <LogOut className="h-4 w-4" /> Se déconnecter
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
