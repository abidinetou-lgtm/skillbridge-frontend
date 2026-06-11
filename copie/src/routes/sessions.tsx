import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Video, Calendar, Coins } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sessions } from "@/lib/mock";

export const Route = createFileRoute("/sessions")({
  head: () => ({
    meta: [
      { title: "Mes sessions — SkillBridge" },
      { name: "description", content: "Gère tes sessions d'enseignement et d'apprentissage." },
    ],
  }),
  component: SessionsPage,
});

const statusStyle: Record<string, string> = {
  upcoming: "bg-sage/12 text-sage",
  live: "bg-orange/15 text-orange",
  completed: "bg-navy/10 text-navy",
  cancelled: "bg-destructive/10 text-destructive",
};
const statusLabel: Record<string, string> = {
  upcoming: "À venir",
  live: "En direct",
  completed: "Terminée",
  cancelled: "Annulée",
};

function SessionsPage() {
  const [tab, setTab] = useState<"teach" | "receive">("teach");
  const list = sessions.filter((s) => s.role === tab);

  return (
    <AppShell footer={false}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-black tracking-tight text-navy">Mes sessions</h1>
          <Button variant="accent" onClick={() => toast.success("Nouvelle session créée")}>
            <Plus className="h-4 w-4" /> Nouvelle session
          </Button>
        </div>

        <div className="mt-6 inline-flex rounded-full border border-border bg-cream p-1">
          {(
            [
              ["teach", "J'enseigne"],
              ["receive", "Je reçois"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === v ? "bg-navy text-cream" : "text-foreground/60 hover:text-navy"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {list.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              Aucune session ici pour l'instant.
            </div>
          )}
          {list.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback
                    className="text-base font-bold text-cream"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-bold text-navy">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.partner}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-foreground/60">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {s.date}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-orange">
                      <Coins className="h-4 w-4" /> {s.credits} cr
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[s.status]}`}>
                  {statusLabel[s.status]}
                </span>
                {s.status === "live" && (
                  <Button asChild variant="accent">
                    <Link to="/room">
                      <Video className="h-4 w-4" /> Rejoindre
                    </Link>
                  </Button>
                )}
                {s.status === "upcoming" && (
                  <Button variant="heroOutline" onClick={() => toast("Session ouverte")}>
                    Ouvrir
                  </Button>
                )}
                {s.status === "completed" && (
                  <Button variant="ghost" onClick={() => toast("Récapitulatif")}>
                    Détails
                  </Button>
                )}
                {s.status === "cancelled" && (
                  <Button variant="ghost" disabled>
                    Annulée
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
