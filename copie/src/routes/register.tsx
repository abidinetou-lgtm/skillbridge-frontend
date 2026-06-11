import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, Check, ArrowRight, ArrowLeft, Coins, Sparkles } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { skillCatalog, days, slots, type SkillCategory } from "@/lib/mock";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Créer un compte — SkillBridge" },
      { name: "description", content: "Rejoins SkillBridge et reçois 120 crédits offerts." },
    ],
  }),
  component: Register,
});

const labels = ["Ton profil", "Tes compétences", "Tes disponibilités"];

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [teach, setTeach] = useState<string[]>([]);
  const [learn, setLearn] = useState<string[]>([]);
  const [grid, setGrid] = useState<Record<string, boolean>>({});

  const toggle = (set: typeof setTeach, list: string[], v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  if (done) {
    return (
      <AuthScreen>
        <div className="animate-fade-up text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sage text-cream">
            <Sparkles className="h-10 w-10" />
          </span>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-navy">
            Bienvenue sur SkillBridge !
          </h1>
          <p className="mt-2 text-foreground/60">Ton compte est prêt. C'est parti.</p>
          <div className="mt-6 rounded-2xl bg-navy p-6 text-cream">
            <p className="inline-flex items-center gap-2 text-sm text-cream/70">
              <Coins className="h-4 w-4 text-orange" /> Crédits de bienvenue
            </p>
            <p className="mt-1 text-5xl font-black text-orange">120</p>
            <p className="text-sm text-cream/70">crédits offerts · 2h de sessions</p>
          </div>
          <Button variant="hero" size="lg" className="mt-6 w-full" onClick={() => navigate({ to: "/" })}>
            Commencer
          </Button>
        </div>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen wide>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
          <span className="text-navy">{labels[step - 1]}</span>
          <span>Étape {step} / 3</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-orange transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <button className="group relative">
              <Avatar className="h-24 w-24 border-2 border-dashed border-border">
                <AvatarFallback className="bg-cream text-muted-foreground">
                  <Camera className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-orange text-cream">
                <Camera className="h-4 w-4" />
              </span>
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground">Photo de profil (optionnel)</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" placeholder="Jimel" />
            <Field label="Nom" placeholder="Mansour" />
          </div>
          <Field label="Email" type="email" placeholder="jimel@email.com" />
          <Field label="Mot de passe" type="password" placeholder="••••••••" />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <SkillPicker
            title="Je veux enseigner"
            selected={teach}
            onToggle={(v) => toggle(setTeach, teach, v)}
            variant="navy"
          />
          <SkillPicker
            title="Je veux apprendre"
            selected={learn}
            onToggle={(v) => toggle(setLearn, learn, v)}
            variant="sage"
          />
        </div>
      )}

      {step === 3 && (
        <div className="overflow-x-auto">
          <div className="min-w-[460px]">
            <div className="grid grid-cols-6 gap-2 text-center text-sm font-bold text-navy">
              <div />
              {days.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            {slots.map((s) => (
              <div key={s.key} className="mt-2 grid grid-cols-6 items-center gap-2">
                <div className="text-left text-sm font-semibold text-navy">{s.label}</div>
                {days.map((d) => {
                  const k = `${d}-${s.key}`;
                  return (
                    <button
                      key={k}
                      onClick={() => setGrid((g) => ({ ...g, [k]: !g[k] }))}
                      className={`grid h-11 place-items-center rounded-xl border transition-colors ${
                        grid[k]
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
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
        ) : (
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-navy">
            Annuler
          </Link>
        )}
        <Button
          variant="hero"
          size="lg"
          onClick={() => (step < 3 ? setStep((s) => s + 1) : setDone(true))}
        >
          {step < 3 ? "Continuer" : "Créer mon compte"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </AuthScreen>
  );
}

function AuthScreen({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full" style={{ maxWidth: wide ? 560 : 420 }}>
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      <Input className="h-11 rounded-xl border-border bg-light-cream" {...props} />
    </div>
  );
}

function SkillPicker({
  title,
  selected,
  onToggle,
  variant,
}: {
  title: string;
  selected: string[];
  onToggle: (v: string) => void;
  variant: "navy" | "sage";
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(skillCatalog) as SkillCategory[]).flatMap((cat) =>
          skillCatalog[cat].slice(0, 3).map((s) => {
            const on = selected.includes(s);
            return (
              <button
                key={s}
                onClick={() => onToggle(s)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  on
                    ? variant === "navy"
                      ? "bg-navy text-cream"
                      : "bg-sage text-cream"
                    : "border border-border bg-cream text-foreground/70 hover:border-orange/50"
                }`}
              >
                {s}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
