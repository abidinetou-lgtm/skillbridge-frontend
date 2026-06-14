import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDecor from "@/components/FloatingDecor";
import Reveal from "@/components/Reveal";
import { SESSIONS, CREDITS_BALANCE, CREDITS_EARNED, CREDITS_SPENT, SLOTS, DAYS, CREDIT_HISTORY } from "@/lib/mock-data";
import { setAuthed } from "@/lib/auth-store";
import { Pencil, Plus, LogOut, Coins, MapPin, GraduationCap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — SkillBridge" },
      { name: "description", content: "Ton profil, tes compétences, tes disponibilités." },
    ],
  }),
  component: ProfilPage,
});

type Tab = "skills" | "card" | "avail" | "sessions" | "history";

function ProfilPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("skills");
  const [picked, setPicked] = useState<Record<string, boolean>>({
    "Lun-Soir": true, "Mar-Midi": true, "Mer-Soir": true, "Jeu-Matin": true,
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Bannière */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#3F6B4C 0%,#252840 60%,#D98E4A 130%)" }}
      >
        <FloatingDecor variant="dense" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-20 text-white sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-wider text-[var(--peach)]">Mon profil</p>
            </Reveal>
            <Reveal delay={1}>
              <div className="mt-4 flex items-center gap-5">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-3xl font-display text-3xl font-extrabold text-[var(--ink)] ring-4 ring-white/30"
                  style={{ background: "var(--peach)" }}
                >
                  LD
                </div>
                <div>
                  <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Léa Dubois</h1>
                  <p className="mt-1 flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" /> L3 Info — Campus Sud
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-4 max-w-xl text-white/85">
                Passionnée de front-end et de typographie. Toujours partante pour debug un bout de React
                avec toi en échange d'une session de Python ou de maths.
              </p>
            </Reveal>
          </div>
          <Reveal delay={3}>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:-translate-y-0.5">
                <Pencil className="h-4 w-4" /> Modifier
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-warm)] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5">
                <Plus className="h-4 w-4" /> Séance
              </button>
              <button
                onClick={() => { setAuthed(false); navigate({ to: "/" }); }}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> Déconnexion
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-4 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-[var(--border)] sm:grid-cols-3 sm:p-6">
            {[
              { l: "Crédits disponibles", v: CREDITS_BALANCE, c: "var(--orange-warm)", icon: Coins },
              { l: "Gagnés", v: CREDITS_EARNED, c: "var(--learn)", icon: GraduationCap },
              { l: "Dépensés", v: CREDITS_SPENT, c: "var(--ink)", icon: Sparkles },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-4 rounded-2xl bg-[var(--cream)] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: s.c, color: "#fff" }}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{s.l}</p>
                  <p className="font-display text-2xl font-extrabold" style={{ color: s.c }}>{s.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="relative overflow-hidden py-12">
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2">
            {([
              ["skills", "Compétences"],
              ["card", "Ma carte"],
              ["avail", "Disponibilités"],
              ["sessions", "Sessions"],
              ["history", "Historique"],
            ] as [Tab, string][]).map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  tab === k
                    ? "bg-[var(--ink)] text-white"
                    : "border border-[var(--border)] bg-white text-[var(--ink)] hover:border-[var(--orange-warm)] hover:text-[var(--orange-warm)]"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            {tab === "skills" && (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange-warm)]">J'enseigne</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["React", "TypeScript", "CSS", "Figma"].map((t) => (
                      <span key={t} className="rounded-full bg-[var(--orange-warm)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--orange-warm-dark)]">
                        {t}
                      </span>
                    ))}
                    <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:border-[var(--orange-warm)]">
                      <Plus className="h-3 w-3" /> Ajouter
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--learn)]">Je veux apprendre</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Python", "Algorithmes", "Guitare"].map((t) => (
                      <span key={t} className="rounded-full bg-[var(--learn)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--learn-dark)]">
                        {t}
                      </span>
                    ))}
                    <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:border-[var(--learn)]">
                      <Plus className="h-3 w-3" /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "card" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <h3 className="font-display text-xl font-bold">Ma carte de visite</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Cette carte s'affiche pour les autres élèves dans la page Connexions.
                  </p>
                </div>
                <div
                  className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl"
                  style={{ background: "linear-gradient(135deg,#252840,#3F6B4C)" }}
                >
                  <FloatingDecor variant="banner" />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-[var(--ink)]" style={{ background: "var(--peach)" }}>LD</div>
                      <div>
                        <p className="font-display text-xl font-bold">Léa Dubois</p>
                        <p className="text-xs text-white/70">L3 Info · Campus Sud</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm">React · TypeScript · CSS · Figma</p>
                    <p className="mt-4 text-xs text-white/70">SkillBridge</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "avail" && (
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Clique sur un créneau pour le rendre disponible.</p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
                  <table className="w-full text-center text-sm">
                    <thead>
                      <tr className="bg-[var(--cream)]">
                        <th></th>
                        {DAYS.map((d) => (<th key={d} className="p-2 font-semibold">{d}</th>))}
                      </tr>
                    </thead>
                    <tbody>
                      {SLOTS.map((s) => (
                        <tr key={s} className="border-t border-[var(--border)]">
                          <td className="bg-[var(--cream)] p-2 text-left font-semibold">{s}</td>
                          {DAYS.map((d) => {
                            const k = `${d}-${s}`;
                            const on = picked[k];
                            return (
                              <td key={k} className="p-1.5">
                                <button
                                  onClick={() => setPicked((p) => ({ ...p, [k]: !on }))}
                                  className={`h-9 w-full rounded-lg text-xs font-semibold transition ${
                                    on
                                      ? "bg-[var(--learn)] text-white"
                                      : "bg-white text-[var(--muted-foreground)] hover:bg-[var(--mint)]/40"
                                  }`}
                                >
                                  {on ? "Dispo" : "—"}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "sessions" && (
              <ul className="divide-y divide-[var(--border)]">
                {SESSIONS.slice(0, 5).map((s) => (
                  <li key={s.id} className="flex items-center gap-4 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl font-bold" style={{ background: s.color }}>{s.initials}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{s.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{s.date} · {s.with}</p>
                    </div>
                    <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold">{s.status}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "history" && (
              <ul className="divide-y divide-[var(--border)]">
                {CREDIT_HISTORY.map((h) => (
                  <li key={h.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold">{h.label}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{h.with} · {h.date}</p>
                    </div>
                    <span className={`font-bold ${h.amount > 0 ? "text-[var(--learn)]" : "text-[var(--orange-warm)]"}`}>
                      {h.amount > 0 ? "+" : ""}{h.amount} cr.
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
