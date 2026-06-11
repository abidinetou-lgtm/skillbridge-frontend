import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Star, Check } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { members, days, slots, type Member } from "@/lib/mock";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Connexions — SkillBridge" },
      { name: "description", content: "Découvre des membres et réserve une session d'apprentissage." },
    ],
  }),
  component: Connections,
});

const filters = ["Tous", "Langues", "Tech", "Arts", "Sport", "Business"];
const tabs = ["Découvrir", "Demandes"];

function Connections() {
  const [tab, setTab] = useState("Découvrir");
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = members.filter((m) => {
    const matchFilter =
      filter === "Tous" || m.teaches.some((t) => t.category === filter);
    const matchQuery =
      query === "" ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.teaches.some((t) => t.name.toLowerCase().includes(query.toLowerCase()));
    return matchFilter && matchQuery;
  });

  return (
    <AppShell footer={false}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-navy">Connexions</h1>
          <p className="mt-2 text-foreground/60">
            Trouve un membre compatible et apprends en échangeant tes crédits.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-flex rounded-full border border-border bg-cream p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === t ? "bg-navy text-cream" : "text-foreground/60 hover:text-navy"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-6 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une compétence ou un membre…"
              className="h-12 rounded-full border-border bg-card pl-12 text-base"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "border-orange bg-orange text-cream"
                  : "border-border bg-card text-foreground/70 hover:border-orange/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tab === "Découvrir" ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MemberCard key={m.id} member={m} onOpen={() => setSelected(m)} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-lg font-semibold text-navy">Aucune demande en attente</p>
            <p className="mt-1 text-muted-foreground">
              Les demandes de réservation que tu reçois apparaîtront ici.
            </p>
          </div>
        )}
      </div>

      <ProfileModal member={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}

function MemberCard({ member, onOpen }: { member: Member; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group flex flex-col rounded-3xl border border-border bg-card p-6 text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback
              className="text-base font-bold text-cream"
              style={{ backgroundColor: member.color }}
            >
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-navy">{member.name}</p>
            {member.rating && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-orange">
                <Star className="h-3.5 w-3.5 fill-orange text-orange" /> {member.rating}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground/70">{member.bio}</p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Enseigne
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {member.teaches.map((t) => (
            <span
              key={t.name}
              className="rounded-lg bg-navy px-2.5 py-1 text-xs font-semibold text-cream"
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {member.availability.map((a) => (
          <span
            key={a}
            className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-foreground/70"
          >
            {a}
          </span>
        ))}
      </div>

      {member.matches && (
        <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-sage/12 px-3 py-1 text-xs font-semibold text-sage">
          <Check className="h-3.5 w-3.5" /> Matches your goals
        </span>
      )}

      <Button variant="hero" className="mt-5 w-full">
        Réserver
      </Button>
    </button>
  );
}

function ProfileModal({ member, onClose }: { member: Member | null; onClose: () => void }) {
  return (
    <Dialog open={!!member} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl">
        {member && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback
                    className="text-lg font-bold text-cream"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <DialogTitle className="text-2xl font-black text-navy">
                    {member.name}
                  </DialogTitle>
                  <DialogDescription className="text-foreground/60">
                    {member.bio}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div>
              <p className="text-sm font-bold text-navy">Compétences enseignées</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.teaches.map((t) => (
                  <span
                    key={t.name}
                    className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-cream"
                  >
                    {t.name} · {t.category}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-navy">Disponibilités</p>
              <div className="mt-2 overflow-hidden rounded-2xl border border-border">
                <div className="grid grid-cols-6 bg-cream text-center text-xs font-semibold text-navy">
                  <div className="p-2" />
                  {days.map((d) => (
                    <div key={d} className="p-2">
                      {d}
                    </div>
                  ))}
                </div>
                {slots.map((s) => (
                  <div key={s.key} className="grid grid-cols-6 border-t border-border text-center">
                    <div className="bg-cream p-2 text-xs font-semibold text-navy">{s.label}</div>
                    {days.map((d) => {
                      const free = member.availability.includes(`${d} ${s.key}`);
                      return (
                        <div key={d} className="p-2">
                          <span
                            className={`mx-auto block h-5 w-5 rounded-md ${
                              free ? "bg-sage" : "bg-muted"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={() => {
                toast.success("Demande de réservation envoyée !", {
                  description: `${member.name} recevra ta demande.`,
                });
                onClose();
              }}
            >
              Envoyer une demande de réservation
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
