import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { isAuthed, setAuthed } from "@/lib/auth-store";
import { Bell, Download, LogOut, Coins, Menu, X } from "lucide-react";
import { CREDITS_BALANCE } from "@/lib/mock-data";

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${
        active ? "text-[var(--orange-warm)]" : "text-[var(--ink)] hover:text-[var(--orange-warm)]"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-[var(--orange-warm)]" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const [authed, setAuthedState] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setAuthedState(isAuthed());
    refresh();
    window.addEventListener("sb-auth-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("sb-auth-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const handleLogout = () => {
    setAuthed(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--cream)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/connexions">Connexions</NavLink>
          {authed && <NavLink to="/sessions">Sessions</NavLink>}
          {authed && <NavLink to="/messages">Messages</NavLink>}
          {authed && <NavLink to="/credits">Crédits</NavLink>}
        </nav>

        {/* Right cluster */}
        <div className="hidden items-center gap-2 md:flex">
          {!authed && (
            <>
              <button className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--orange-warm)] hover:text-[var(--orange-warm)]">
                <Download className="h-4 w-4" /> Installer l'app
              </button>
              <Link
                to="/auth/login"
                className="rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
              >
                Se connecter
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-[var(--orange-warm)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--orange-warm-dark)] hover:-translate-y-0.5"
              >
                S'inscrire
              </Link>
            </>
          )}
          {authed && (
            <>
              <div className="relative">
                <button
                  onClick={() => { setShowCredits((s) => !s); setShowNotifs(false); }}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-warm)] px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--orange-warm-dark)] hover:-translate-y-0.5"
                >
                  <Coins className="h-4 w-4" /> {CREDITS_BALANCE} cr.
                </button>
                {showCredits && (
                  <div className="modal-pop absolute right-0 top-12 w-72 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl">
                    <h4 className="font-display text-base font-bold">Comment ça marche ?</h4>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      <strong>1 crédit = 1 minute</strong> de cours. Tu gagnes des crédits en
                      enseignant et tu les dépenses en apprenant. Pas d'argent, juste de l'entraide.
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Plafond : <strong>500 crédits</strong>. Ça t'évite de thésauriser.
                    </p>
                    <Link
                      to="/credits"
                      onClick={() => setShowCredits(false)}
                      className="mt-3 inline-block text-sm font-semibold text-[var(--orange-warm)] hover:underline"
                    >
                      Voir mes crédits →
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => { setShowNotifs((s) => !s); setShowCredits(false); }}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--ink)] transition hover:border-[var(--orange-warm)] hover:text-[var(--orange-warm)]"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--orange-warm)]" />
                </button>
                {showNotifs && (
                  <div className="modal-pop absolute right-0 top-12 w-80 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-xl">
                    <h4 className="px-2 pb-2 font-display text-base font-bold">Notifications</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="rounded-xl bg-[var(--cream)] p-3">
                        <strong>Inès</strong> a confirmé la session React de demain.
                      </li>
                      <li className="rounded-xl bg-[var(--cream)] p-3">
                        Tu as gagné <strong>+45 crédits</strong> pour ton cours d'anglais.
                      </li>
                      <li className="rounded-xl bg-[var(--cream)] p-3">
                        <strong>Tom</strong> aimerait apprendre Docker avec toi.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <Link
                to="/profil"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full font-bold text-[var(--ink)]"
                style={{ background: "var(--peach)" }}
                aria-label="Profil"
              >
                LD
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--ink)] transition hover:border-[var(--orange-warm)] hover:text-[var(--orange-warm)]"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--cream)]">Accueil</Link>
            <Link to="/connexions" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--cream)]">Connexions</Link>
            {authed && <Link to="/sessions" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--cream)]">Sessions</Link>}
            {authed && <Link to="/messages" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--cream)]">Messages</Link>}
            {authed && <Link to="/credits" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--cream)]">Crédits</Link>}
            {authed && <Link to="/profil" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--cream)]">Profil</Link>}
            <div className="mt-2 flex flex-col gap-2">
              {!authed ? (
                <>
                  <Link to="/auth/login" onClick={() => setOpen(false)} className="rounded-full border border-[var(--ink)] px-4 py-2 text-center text-sm font-semibold">Se connecter</Link>
                  <Link to="/auth/register" onClick={() => setOpen(false)} className="rounded-full bg-[var(--orange-warm)] px-4 py-2 text-center text-sm font-semibold text-white">S'inscrire</Link>
                </>
              ) : (
                <button onClick={() => { handleLogout(); setOpen(false); }} className="rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-semibold">Se déconnecter</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
