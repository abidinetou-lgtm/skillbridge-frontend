import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Coins, Check, ShieldCheck, Infinity as InfinityIcon, Zap, AlertTriangle } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { creditPacks } from "@/lib/mock";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Acheter des crédits — SkillBridge" },
      { name: "description", content: "Achète des crédits pour réserver tes sessions. Les crédits n'expirent jamais." },
    ],
  }),
  component: Credits,
});

const LIMIT = 500;

function Credits() {
  const balance = 240;
  const [purchased, setPurchased] = useState<(typeof creditPacks)[number] | null>(null);

  if (purchased) {
    return (
      <AppShell footer={false}>
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
          <div className="w-full animate-fade-up rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="mx-auto grid h-20 w-20 animate-fade-up place-items-center rounded-full bg-sage text-cream">
              <Check className="h-10 w-10" />
            </span>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-navy">Paiement réussi !</h1>
            <p className="mt-2 text-foreground/60">
              {purchased.credits} crédits ont été ajoutés à ton compte.
            </p>
            <div className="mt-6 rounded-2xl bg-cream p-5">
              <p className="text-sm text-muted-foreground">Nouveau solde</p>
              <p className="text-4xl font-black text-navy">
                {Math.min(balance + purchased.credits, LIMIT)} cr
              </p>
            </div>
            <Button variant="hero" size="lg" className="mt-6 w-full" onClick={() => setPurchased(null)}>
              Retour aux crédits
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell footer={false}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-navy">Acheter des crédits</h1>
          <p className="mt-2 text-foreground/60">
            Les crédits n'expirent jamais · limite de {LIMIT} cr
          </p>
        </div>

        {/* Balance card */}
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange/12 text-orange">
                <Coins className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Solde actuel</p>
                <p className="text-2xl font-black text-navy">{balance} cr</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {balance} / {LIMIT}
            </p>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage to-orange"
              style={{ width: `${(balance / LIMIT) * 100}%` }}
            />
          </div>
        </div>

        {/* Packs */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {creditPacks.map((p) => {
            const exceeds = balance + p.credits > LIMIT;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl border bg-card p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 ${
                  p.popular ? "border-2 border-orange" : "border-border"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-orange px-3 py-1 text-xs font-bold text-cream">
                    Populaire
                  </span>
                )}
                {exceeds && (
                  <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                    <AlertTriangle className="h-3 w-3" /> Dépasse la limite
                  </span>
                )}
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {p.name}
                </p>
                <p className="mt-3 text-4xl font-black text-navy">
                  {p.credits} <span className="text-lg font-bold text-orange">cr</span>
                </p>
                <p className="mt-1 text-foreground/60">
                  {p.price} · {p.hours} de session
                </p>
                <Button
                  variant={p.popular ? "accent" : "hero"}
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => setPurchased(p)}
                >
                  Acheter
                </Button>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "Paiement sécurisé" },
            { icon: InfinityIcon, label: "Crédits permanents" },
            { icon: Zap, label: "Utilisation instantanée" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-navy"
            >
              <b.icon className="h-5 w-5 text-sage" /> {b.label}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
