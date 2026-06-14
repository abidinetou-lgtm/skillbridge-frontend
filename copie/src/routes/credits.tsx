import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDecor from "@/components/FloatingDecor";
import Reveal from "@/components/Reveal";
import { CREDITS_BALANCE, CREDITS_CAP, CREDITS_EARNED, CREDITS_SPENT, CREDIT_HISTORY } from "@/lib/mock-data";
import { ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Crédits — SkillBridge" },
      { name: "description", content: "Tes crédits, ton historique, ton plafond." },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  const pct = Math.round((CREDITS_BALANCE / CREDITS_CAP) * 100);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden bg-[var(--ink)] py-16 text-white">
        <FloatingDecor variant="banner" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--orange-warm)]">Tes crédits</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-3 font-display text-5xl font-extrabold sm:text-6xl">
              {CREDITS_BALANCE} <span className="text-[var(--orange-warm)]">crédits</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-2 text-white/75">soit <strong>{CREDITS_BALANCE} minutes</strong> de cours disponibles.</p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 max-w-2xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/70">
                <span>Progression vers le plafond</span>
                <span>{CREDITS_BALANCE} / {CREDITS_CAP}</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--orange-warm)] to-[var(--peach)] transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/60">
                Plafond à 500 crédits pour t'inciter à apprendre plutôt qu'à thésauriser.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-12">
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { l: "Solde", v: CREDITS_BALANCE, c: "var(--orange-warm)" },
              { l: "Gagnés au total", v: CREDITS_EARNED, c: "var(--learn)" },
              { l: "Dépensés au total", v: CREDITS_SPENT, c: "var(--ink)" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={((i + 1) as 1 | 2 | 3)}>
                <div className="card-lift rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{s.l}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold" style={{ color: s.c }}>{s.v}</span>
                    <span className="text-sm text-[var(--muted-foreground)]">crédits</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={2}>
            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Historique</h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold">
                  <Coins className="h-3.5 w-3.5" /> 1 cr = 1 min
                </span>
              </div>
              <ul className="mt-6 divide-y divide-[var(--border)]">
                {CREDIT_HISTORY.map((h) => {
                  const gain = h.amount > 0;
                  return (
                    <li key={h.id} className="flex items-center gap-4 py-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          gain ? "bg-[var(--learn)]/15 text-[var(--learn)]" : "bg-[var(--orange-warm)]/15 text-[var(--orange-warm)]"
                        }`}
                      >
                        {gain ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{h.label}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">avec {h.with} · {h.date}</p>
                      </div>
                      <span
                        className={`font-display text-lg font-extrabold ${
                          gain ? "text-[var(--learn)]" : "text-[var(--orange-warm)]"
                        }`}
                      >
                        {gain ? "+" : ""}{h.amount} cr.
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 rounded-2xl bg-[var(--cream)] p-4 text-center text-sm text-[var(--muted-foreground)]">
                Les crédits ne s'achètent pas. Ils se gagnent, en enseignant.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
