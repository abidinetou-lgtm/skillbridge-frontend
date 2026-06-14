import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDecor from "@/components/FloatingDecor";
import Reveal from "@/components/Reveal";
import Modal from "@/components/Modal";
import { SESSIONS, type Session } from "@/lib/mock-data";
import { Calendar, Clock, Coins, Video, Mic, MicOff, VideoOff, PhoneOff, Sparkles } from "lucide-react";

export const Route = createFileRoute("/sessions")({
  head: () => ({
    meta: [
      { title: "Sessions — SkillBridge" },
      { name: "description", content: "Tes sessions à venir, en cours et passées." },
    ],
  }),
  component: SessionsPage,
});

const STATUS_COLORS: Record<Session["status"], string> = {
  "À venir": "bg-[var(--sky)] text-[var(--ink)]",
  "En cours": "bg-[var(--learn)] text-white",
  "Terminée": "bg-[var(--cream)] text-[var(--muted-foreground)]",
  "En attente": "bg-[var(--sun)] text-[var(--ink)]",
};

function SessionCard({ s, onOpen }: { s: Session; onOpen: () => void }) {
  return (
    <article
      onClick={onOpen}
      className="card-lift cursor-pointer rounded-3xl bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[s.status]}`}>{s.status}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold text-[var(--ink)]">
          <Coins className="h-3 w-3" /> {s.credits} cr.
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: s.color }}
        >
          {s.initials}
        </div>
        <div className="text-sm">
          <p className="font-semibold">{s.with}</p>
          <p className="text-[var(--muted-foreground)]">{s.role === "teach" ? "tu enseignes" : "tu apprends"}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {s.date}</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.duration} min</span>
      </div>
    </article>
  );
}

type Tab = "teach" | "learn";

function CallRoom({ session, onEnd }: { session: Session; onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ended]);

  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, "0");
  const credits = Math.max(1, Math.ceil(seconds / 60));

  if (ended) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--learn)]/15 text-[var(--learn)]">
          <Sparkles className="h-9 w-9" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold">Session terminée</h3>
        <p className="mt-1 text-[var(--muted-foreground)]">Bravo, bel échange avec {session.with}.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--cream)] p-4">
            <p className="text-xs uppercase text-[var(--muted-foreground)]">Durée</p>
            <p className="mt-1 font-display text-2xl font-extrabold">{mins} min {secs}s</p>
          </div>
          <div className="rounded-2xl bg-[var(--orange-warm)]/15 p-4">
            <p className="text-xs uppercase text-[var(--orange-warm-dark)]">{session.role === "teach" ? "Gagnés" : "Dépensés"}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-[var(--orange-warm-dark)]">
              {session.role === "teach" ? "+" : "-"}{credits} cr.
            </p>
          </div>
        </div>
        <button
          onClick={onEnd}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--ink)] px-5 py-3 font-bold text-white"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ink)] to-[#0e1024]">
        <FloatingDecor variant="ambient" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE — {mins.toString().padStart(2, "0")}:{secs}
        </div>
        <div className="absolute bottom-4 right-4 h-24 w-32 overflow-hidden rounded-xl border-2 border-white/30 bg-gradient-to-br from-[var(--orange-warm)] to-[var(--orange-warm-dark)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl font-extrabold text-[var(--ink)]"
            style={{ background: session.color }}
          >
            {session.initials}
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => setMic((v) => !v)}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${mic ? "bg-white border border-[var(--border)]" : "bg-[var(--destructive)] text-white"}`}
        >
          {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setCam((v) => !v)}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${cam ? "bg-white border border-[var(--border)]" : "bg-[var(--destructive)] text-white"}`}
        >
          {cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setEnded(true)}
          className="flex h-12 items-center gap-2 rounded-full bg-[var(--destructive)] px-5 font-bold text-white"
        >
          <PhoneOff className="h-5 w-5" /> Terminer
        </button>
      </div>
    </div>
  );
}

function SessionsPage() {
  const [tab, setTab] = useState<Tab>("teach");
  const [open, setOpen] = useState<Session | null>(null);
  const [inCall, setInCall] = useState(false);

  const list = SESSIONS.filter((s) => s.role === tab);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden bg-[var(--cream)] py-14">
        <FloatingDecor variant="banner" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--orange-warm)]">Tes sessions</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">À l'agenda de la semaine</h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-white p-1 shadow-sm">
              <button
                onClick={() => setTab("teach")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === "teach" ? "bg-[var(--orange-warm)] text-white" : "text-[var(--ink)]"}`}
              >
                J'enseigne
              </button>
              <button
                onClick={() => setTab("learn")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === "learn" ? "bg-[var(--learn)] text-white" : "text-[var(--ink)]"}`}
              >
                Je reçois
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-12">
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto max-w-7xl px-6">
          {list.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-center text-[var(--muted-foreground)] shadow-sm">
              Aucune session pour le moment.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <Reveal key={s.id} delay={(((i % 4) + 1) as 1 | 2 | 3 | 4)}>
                  <SessionCard s={s} onOpen={() => { setOpen(s); setInCall(false); }} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal open={!!open} onClose={() => setOpen(null)} title={inCall ? undefined : open?.title} size="lg">
        {open && (inCall ? (
          <CallRoom session={open} onEnd={() => { setInCall(false); setOpen(null); }} />
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full font-bold" style={{ background: open.color }}>{open.initials}</div>
              <div className="text-sm">
                <p className="font-semibold">{open.with}</p>
                <p className="text-[var(--muted-foreground)]">{open.role === "teach" ? "tu enseignes" : "tu apprends"}</p>
              </div>
              <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[open.status]}`}>{open.status}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs uppercase text-[var(--muted-foreground)]">Quand</p>
                <p className="mt-1 font-semibold">{open.date}</p>
              </div>
              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs uppercase text-[var(--muted-foreground)]">Durée</p>
                <p className="mt-1 font-semibold">{open.duration} minutes</p>
              </div>
              <div className="rounded-2xl bg-[var(--cream)] p-4">
                <p className="text-xs uppercase text-[var(--muted-foreground)]">Crédits</p>
                <p className="mt-1 font-semibold">{open.role === "teach" ? "+" : "-"}{open.credits} cr.</p>
              </div>
            </div>
            <p className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-foreground)] ring-1 ring-[var(--border)]">{open.details}</p>
            <button
              onClick={() => setInCall(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)]"
            >
              <Video className="h-4 w-4" /> Rejoindre la session
            </button>
          </div>
        ))}
      </Modal>

      <Footer />
    </div>
  );
}
