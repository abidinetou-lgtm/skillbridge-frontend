import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setAuthed } from "@/lib/auth-store";
import { Mail, Lock, User, ArrowRight, Check, GraduationCap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Créer un compte — SkillBridge" }] }),
  component: RegisterPage,
});

const ALL_SKILLS = ["React", "Python", "Maths", "Anglais", "Design UI", "Guitare", "Cuisine", "Algorithmes", "Réseau", "Cybersécurité", "Espagnol", "Photo", "Data Science", "Git", "Docker"];

type Tab = "teach" | "learn";

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [tab, setTab] = useState<Tab>("teach");
  const [teach, setTeach] = useState<Set<string>>(new Set());
  const [learn, setLearn] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, s: string) => {
    const next = new Set(set);
    next.has(s) ? next.delete(s) : next.add(s);
    setSet(next);
  };

  const canNext1 = name.trim() && email.includes("@") && pwd.length >= 4;
  const canNext2 = teach.size > 0 && learn.size > 0;

  return (
    <div className="w-full max-w-2xl">
      {/* Steps bar */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                step >= n ? "bg-[var(--orange-warm)] text-white" : "bg-white text-[var(--muted-foreground)] ring-1 ring-[var(--border)]"
              }`}
            >
              {step > n ? <Check className="h-4 w-4" /> : n}
            </div>
            {n < 3 && (
              <div className={`h-1 flex-1 rounded-full ${step > n ? "bg-[var(--orange-warm)]" : "bg-[var(--border)]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[var(--border)]">
        {step === 1 && (
          <>
            <h2 className="font-display text-3xl font-extrabold">Bienvenue !</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">On commence par les bases.</p>
            <div className="mt-6 space-y-4">
              <Field icon={User} label="Nom complet" value={name} onChange={setName} />
              <Field icon={Mail} label="Email scolaire" type="email" value={email} onChange={setEmail} />
              <Field icon={Lock} label="Mot de passe" type="password" value={pwd} onChange={setPwd} />
            </div>
            <button
              onClick={() => canNext1 && setStep(2)}
              disabled={!canNext1}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)] disabled:opacity-50"
            >
              Continuer <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-5 text-center text-sm text-[var(--muted-foreground)]">
              Déjà inscrit·e ?{" "}
              <Link to="/auth/login" className="font-semibold text-[var(--ink)] hover:text-[var(--orange-warm)]">Se connecter</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-3xl font-extrabold">Tes compétences</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Choisis ce que tu sais faire <strong>et</strong> ce que tu veux apprendre. Les deux sont nécessaires.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-[var(--cream)] p-1">
              <button
                onClick={() => setTab("teach")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  tab === "teach" ? "bg-[var(--orange-warm)] text-white" : "text-[var(--ink)]"
                }`}
              >
                <Sparkles className="h-4 w-4" /> J'enseigne <span className="text-xs opacity-80">({teach.size})</span>
              </button>
              <button
                onClick={() => setTab("learn")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  tab === "learn" ? "bg-[var(--learn)] text-white" : "text-[var(--ink)]"
                }`}
              >
                <GraduationCap className="h-4 w-4" /> J'apprends <span className="text-xs opacity-80">({learn.size})</span>
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {ALL_SKILLS.map((s) => {
                const set = tab === "teach" ? teach : learn;
                const setSet = tab === "teach" ? setTeach : setLearn;
                const color = tab === "teach" ? "var(--orange-warm)" : "var(--learn)";
                const on = set.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(set, setSet, s)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                      on
                        ? "text-white"
                        : "border border-[var(--border)] bg-white text-[var(--ink)] hover:border-[var(--orange-warm)]"
                    }`}
                    style={on ? { background: color } : undefined}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(1)} className="rounded-full border border-[var(--border)] px-5 py-3 font-bold">
                Retour
              </button>
              <button
                onClick={() => canNext2 && setStep(3)}
                disabled={!canNext2}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)] disabled:opacity-50"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {!canNext2 && (
              <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
                Sélectionne au moins 1 compétence dans chaque onglet pour continuer.
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display text-3xl font-extrabold">Presque prêt·e !</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Vérifie ton récap. Tu reçois <strong>60 crédits offerts</strong> pour démarrer.
            </p>
            <div className="mt-5 space-y-3">
              <Row label="Nom" value={name} />
              <Row label="Email" value={email} />
              <Row label="J'enseigne" value={[...teach].join(", ")} />
              <Row label="J'apprends" value={[...learn].join(", ")} />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(2)} className="rounded-full border border-[var(--border)] px-5 py-3 font-bold">
                Retour
              </button>
              <button
                onClick={() => { setAuthed(true); navigate({ to: "/auth/verify-email" }); }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)]"
              >
                Créer mon compte <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type = "text", value, onChange }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; type?: string; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">{label}</span>
      <div className="relative mt-1">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--cream)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--orange-warm)] focus:ring-2 focus:ring-[var(--orange-warm)]/25"
        />
      </div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-[var(--cream)] p-3 text-sm">
      <span className="font-bold">{label}</span>
      <span className="text-right text-[var(--muted-foreground)]">{value || "—"}</span>
    </div>
  );
}
