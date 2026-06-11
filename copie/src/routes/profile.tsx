import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  Coins,
  TrendingUp,
  TrendingDown,
  Plus,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { days, slots, sessions, transactions } from "@/lib/mock";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Mon profil — SkillBridge" },
      { name: "description", content: "Gère tes compétences, tes disponibilités et tes crédits." },
    ],
  }),
  component: Profile,
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

function Profile() {
  const [grid, setGrid] = useState<Record<string, boolean>>({
    "Mon-Morning": true,
    "Wed-Evening": true,
    "Fri-Noon": true,
  });

  const toggle = (k: string) => setGrid((g) => ({ ...g, [k]: !g[k] }));

  return (
    <AppShell footer={false}>
      {/* Cover banner */}
      <div className="h-44 w-full sm:h-56" style={{ background: "var(--gradient-banner)" }} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="-mt-16 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
          <button className="group relative" onClick={() => toast("Changer la photo de profil")}>
            <Avatar className="h-32 w-32 border-4 border-light-cream shadow-lg">
              <AvatarFallback className="bg-navy text-3xl font-black text-cream">JM</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-orange text-cream shadow">
              <Camera className="h-4 w-4" />
            </span>
          </button>
          <div className="pb-2 text-center sm:text-left">
            <h1 className="text-3xl font-black tracking-tight text-navy">Jimel Mansour</h1>
            <p className="text-foreground/60">jimel@skillbridge.io</p>
            <p className="mt-1 max-w-md text-sm text-foreground/70">
              Développeur & musicien. J'enseigne le code et le piano, j'apprends l'espagnol.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Coins} label="Crédits disponibles" value="240" tint="navy" />
          <StatCard icon={TrendingUp} label="Crédits gagnés" value="540" tint="sage" />
          <StatCard icon={TrendingDown} label="Crédits dépensés" value="300" tint="orange" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="skills" className="mt-10">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-cream p-1">
            {[
              ["skills", "Compétences"],
              ["card", "Ma carte"],
              ["availability", "Disponibilités"],
              ["sessions", "Sessions"],
              ["history", "Historique"],
            ].map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-navy data-[state=active]:text-cream"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Skills */}
          <TabsContent value="skills" className="mt-6 space-y-6">
            <SkillSection
              title="J'enseigne"
              skills={["React", "TypeScript", "Piano", "Git"]}
              variant="navy"
            />
            <SkillSection
              title="Je veux apprendre"
              skills={["Espagnol", "Photographie", "Yoga"]}
              variant="sage"
            />
          </TabsContent>

          {/* My Card */}
          <TabsContent value="card" className="mt-6">
            <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-navy text-base font-bold text-cream">
                    JM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-navy">Jimel Mansour</p>
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-orange">
                    ★ 4.7
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/70">
                Développeur & musicien. J'enseigne le code et le piano.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Enseigne
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["React", "TypeScript", "Piano"].map((s) => (
                  <span key={s} className="rounded-lg bg-navy px-2.5 py-1 text-xs font-semibold text-cream">
                    {s}
                  </span>
                ))}
              </div>
              <Button variant="hero" className="mt-5 w-full">
                Aperçu public
              </Button>
            </div>
          </TabsContent>

          {/* Availability */}
          <TabsContent value="availability" className="mt-6">
            <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-6">
              <div className="overflow-x-auto">
                <div className="min-w-[480px]">
                  <div className="grid grid-cols-6 gap-2 text-center text-sm font-bold text-navy">
                    <div />
                    {days.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  {slots.map((s) => (
                    <div key={s.key} className="mt-2 grid grid-cols-6 items-center gap-2">
                      <div className="text-left">
                        <p className="text-sm font-semibold text-navy">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.hint}</p>
                      </div>
                      {days.map((d) => {
                        const k = `${d}-${s.key}`;
                        const on = grid[k];
                        return (
                          <button
                            key={k}
                            onClick={() => toggle(k)}
                            className={`grid h-11 place-items-center rounded-xl border transition-colors ${
                              on
                                ? "border-sage bg-sage text-cream"
                                : "border-border bg-cream text-transparent hover:border-sage/50"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="accent"
                className="mt-6"
                onClick={() => toast.success("Disponibilités enregistrées !")}
              >
                Enregistrer
              </Button>
            </div>
          </TabsContent>

          {/* Sessions */}
          <TabsContent value="sessions" className="mt-6 space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback
                      className="text-sm font-bold text-cream"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-navy">{s.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.partner} · {s.date}
                    </p>
                  </div>
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[s.status]}`}>
                  {statusLabel[s.status]}
                </span>
              </div>
            ))}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="mt-6 space-y-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      t.amount > 0 ? "bg-sage/12 text-sage" : "bg-orange/12 text-orange"
                    }`}
                  >
                    {t.amount > 0 ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <p className="font-semibold text-navy">{t.label}</p>
                    <p className="text-sm text-muted-foreground">{t.date}</p>
                  </div>
                </div>
                <span
                  className={`text-lg font-black ${t.amount > 0 ? "text-sage" : "text-orange"}`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount}
                </span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  tint: "navy" | "sage" | "orange";
}) {
  const tints = {
    navy: "bg-navy/10 text-navy",
    sage: "bg-sage/12 text-sage",
    orange: "bg-orange/12 text-orange",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${tints[tint]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-black text-navy">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function SkillSection({
  title,
  skills,
  variant,
}: {
  title: string;
  skills: string[];
  variant: "navy" | "sage";
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-bold text-navy">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-cream ${
              variant === "navy" ? "bg-navy" : "bg-sage"
            }`}
          >
            {s}
          </span>
        ))}
        <button
          onClick={() => toast("Ajouter une compétence")}
          className="inline-flex items-center gap-1 rounded-lg border-2 border-dashed border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-orange hover:text-orange"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>
    </div>
  );
}
