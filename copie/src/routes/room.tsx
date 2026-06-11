import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Coins,
  Mic,
  MicOff,
  UserX,
  Lock,
  Users,
  Star,
  PhoneOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/room")({
  head: () => ({
    meta: [{ title: "Session en cours — SkillBridge" }],
  }),
  component: SessionRoom,
});

const participants = [
  { id: "1", name: "Sofia Marchetti", initials: "SM", color: "#252840", muted: false },
  { id: "2", name: "Toi", initials: "JM", color: "#c8864b", muted: false },
  { id: "3", name: "Léo Dupont", initials: "LD", color: "#3d5c28", muted: true },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function SessionRoom() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [ended, setEnded] = useState(false);
  const [rating, setRating] = useState(0);
  const [locked, setLocked] = useState(false);
  const [muted, setMuted] = useState<Record<string, boolean>>({ "3": true });

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [ended]);

  if (ended) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1410] px-4 text-cream">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-black tracking-tight">Session terminée</h1>
          <p className="mt-2 text-cream/60">Comment s'est passée ta session avec Sofia ?</p>

          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} étoiles`}>
                <Star
                  className={`h-9 w-9 transition-colors ${
                    n <= rating ? "fill-orange text-orange" : "text-white/25"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-2 rounded-2xl bg-white/5 p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-cream/60">Durée</span>
              <span className="font-semibold">{fmt(seconds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream/60">Crédits transférés</span>
              <span className="font-semibold text-orange">+60 cr</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-cream/60">Nouveau solde</span>
              <span className="font-black">300 cr</span>
            </div>
          </div>

          <Button
            variant="accent"
            size="lg"
            className="mt-6 w-full"
            onClick={() => navigate({ to: "/sessions" })}
          >
            Retour aux sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1410] text-cream">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/sessions"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-bold leading-tight">Conversation anglais avancé</p>
            <p className="text-sm text-cream/60">avec Sofia Marchetti</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/5 px-3 py-1.5 font-mono text-sm font-semibold">
            {fmt(seconds)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/20 px-3 py-1.5 text-sm font-semibold text-orange">
            <Coins className="h-4 w-4" /> 60 cr
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black">
            {/* Jitsi iframe placeholder */}
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#252840] to-[#1a1410]">
              <div className="text-center">
                <Avatar className="mx-auto h-24 w-24 border-2 border-orange">
                  <AvatarFallback className="bg-navy text-2xl font-black text-cream">
                    SM
                  </AvatarFallback>
                </Avatar>
                <p className="mt-4 font-semibold">Flux vidéo Jitsi</p>
                <p className="text-sm text-cream/50">meet.jit.si/skillbridge-session</p>
              </div>
            </div>
            {/* Self preview */}
            <div className="absolute bottom-4 right-4 grid h-28 w-40 place-items-center rounded-2xl border border-white/15 bg-[#252840]">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-orange text-sm font-bold text-cream">JM</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="destructive" size="lg" onClick={() => setEnded(true)}>
              <PhoneOff className="h-5 w-5" /> Terminer la session
            </Button>
          </div>
        </div>

        {/* Admin sidebar (teacher only) */}
        <aside className="w-full shrink-0 rounded-3xl border border-white/10 bg-white/5 p-5 lg:w-80">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange">
            <Users className="h-4 w-4" /> Panneau hôte
          </div>

          <p className="mt-4 text-sm font-semibold text-cream/70">Participants</p>
          <div className="mt-2 space-y-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="text-[10px] font-bold text-cream"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{p.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMuted((m) => ({ ...m, [p.id]: !m[p.id] }))}
                    className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10"
                    aria-label="Couper le micro"
                  >
                    {muted[p.id] ? (
                      <MicOff className="h-4 w-4 text-destructive" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    className="grid h-8 w-8 place-items-center rounded-lg text-cream/60 hover:bg-white/10 hover:text-destructive"
                    aria-label="Exclure"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Lock className="h-4 w-4" /> Verrouiller la session
            </span>
            <Switch checked={locked} onCheckedChange={setLocked} />
          </div>

          <div className="mt-3 rounded-xl bg-white/5 px-3 py-3">
            <label className="text-sm font-semibold text-cream/70">Limite de participants</label>
            <input
              type="number"
              defaultValue={2}
              min={1}
              max={10}
              className="mt-2 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-orange"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
