import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDecor from "@/components/FloatingDecor";
import Reveal from "@/components/Reveal";
import Modal from "@/components/Modal";
import { CATEGORIES, MEMBERS, DAYS, SLOTS, type Member } from "@/lib/mock-data";
import { Search, Star, CalendarCheck, Send } from "lucide-react";

export const Route = createFileRoute("/connexions")({
  head: () => ({
    meta: [
      { title: "Connexions — SkillBridge" },
      { name: "description", content: "Trouve un·e camarade qui enseigne ce que tu cherches à apprendre." },
      { property: "og:title", content: "Connexions — SkillBridge" },
    ],
  }),
  component: ConnectionsPage,
});

const WANTS_HIGHLIGHT = new Set(["React", "Python", "Anglais"]);

function MemberCard({ m, onOpen }: { m: Member; onOpen: () => void }) {
  return (
    <article className="card-lift flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-bold text-[var(--ink)]"
          style={{ background: m.avatarColor }}
        >
          {m.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold">{m.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Star className="h-3.5 w-3.5 fill-[var(--orange-warm)] text-[var(--orange-warm)]" />
            <span className="font-semibold text-[var(--ink)]">{m.rating.toFixed(1)}</span>
            <span>· {m.category}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-[var(--muted-foreground)]">{m.bio}</p>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]/70">Enseigne</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {m.teaches.map((t) => {
            const match = WANTS_HIGHLIGHT.has(t);
            return (
              <span
                key={t}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  match
                    ? "bg-[var(--orange-warm)] text-white"
                    : "bg-[var(--cream)] text-[var(--ink)]"
                }`}
              >
                {match && <Star className="h-3 w-3 fill-white" />}
                {t}
              </span>
            );
          })}
        </div>
      </div>

      <button
        onClick={onOpen}
        className="mt-5 inline-flex items-center justify-center gap-2 self-stretch rounded-full bg-[var(--orange-warm)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--orange-warm-dark)] hover:-translate-y-0.5"
      >
        <CalendarCheck className="h-4 w-4" /> Réserver
      </button>
    </article>
  );
}

function ConnectionsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tous");
  const [open, setOpen] = useState<Member | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const filtered = useMemo(() => {
    return MEMBERS.filter((m) => {
      if (cat !== "Tous" && m.category !== cat) return false;
      if (!q) return true;
      const hay = [m.name, m.bio, ...m.teaches].join(" ").toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, cat]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden bg-[var(--cream)] py-16">
        <FloatingDecor variant="banner" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--orange-warm)]">Connexions</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Avec qui veux-tu apprendre aujourd'hui ?
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cherche par nom, matière, techno..."
                  className="w-full rounded-full border border-[var(--border)] bg-white py-3 pl-11 pr-5 text-sm shadow-sm outline-none focus:border-[var(--orange-warm)] focus:ring-2 focus:ring-[var(--orange-warm)]/30"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    cat === c
                      ? "bg-[var(--ink)] text-white"
                      : "border border-[var(--border)] bg-white text-[var(--ink)] hover:border-[var(--orange-warm)] hover:text-[var(--orange-warm)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-12">
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto max-w-7xl px-6">
          {filtered.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-center text-[var(--muted-foreground)] shadow-sm">
              Aucun·e camarade ne correspond. Essaie un autre filtre.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m, i) => (
                <Reveal key={m.id} delay={(((i % 4) + 1) as 1 | 2 | 3 | 4)}>
                  <MemberCard m={m} onOpen={() => { setOpen(m); setPicked({}); setSent(false); }} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name} size="lg">
        {open && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl font-bold"
                style={{ background: open.avatarColor }}
              >
                {open.initials}
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-[var(--orange-warm)] text-[var(--orange-warm)]" />
                  <span className="font-bold">{open.rating.toFixed(1)}</span>
                  <span className="text-[var(--muted-foreground)]">· {open.category}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{open.bio}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange-warm)]">Enseigne</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {open.teaches.map((t) => (
                    <span key={t} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--learn)]">Veut apprendre</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {open.wants.map((t) => (
                    <span key={t} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold">Disponibilités</p>
              <p className="text-xs text-[var(--muted-foreground)]">Choisis un ou plusieurs créneaux.</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full text-center text-sm">
                  <thead>
                    <tr className="bg-[var(--cream)]">
                      <th className="p-2"></th>
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
                          // mock availability
                          const available = ((d.charCodeAt(0) + s.charCodeAt(0)) % 3) !== 0;
                          return (
                            <td key={k} className="p-1.5">
                              <button
                                disabled={!available}
                                onClick={() => setPicked((p) => ({ ...p, [k]: !on }))}
                                className={`h-8 w-full rounded-lg text-xs font-semibold transition ${
                                  !available
                                    ? "bg-[var(--cream)] text-[var(--muted-foreground)]/50"
                                    : on
                                    ? "bg-[var(--orange-warm)] text-white"
                                    : "bg-white text-[var(--ink)] hover:bg-[var(--peach)]/50"
                                }`}
                              >
                                {available ? (on ? "✓" : "Libre") : "—"}
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

            {sent ? (
              <div className="rounded-2xl bg-[var(--learn)]/10 p-4 text-center text-sm font-semibold text-[var(--learn-dark)]">
                Demande envoyée à {open.name} ✦ Tu recevras une notification.
              </div>
            ) : (
              <button
                onClick={() => setSent(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)]"
              >
                <Send className="h-4 w-4" /> Envoyer une demande de réservation
              </button>
            )}
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
