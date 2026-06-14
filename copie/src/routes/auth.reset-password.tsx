import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Réinitialiser le mot de passe — SkillBridge" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [done, setDone] = useState(false);
  const ok = a.length >= 6 && a === b;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[var(--border)]">
        {!done ? (
          <form onSubmit={(e) => { e.preventDefault(); if (ok) setDone(true); }}>
            <h2 className="font-display text-3xl font-extrabold">Nouveau mot de passe</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Choisis-en un solide (6 caractères minimum).</p>
            <div className="mt-6 space-y-4">
              <FieldPwd label="Nouveau mot de passe" value={a} onChange={setA} />
              <FieldPwd label="Confirme le mot de passe" value={b} onChange={setB} />
            </div>
            <button
              disabled={!ok}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)] disabled:opacity-50"
            >
              Mettre à jour <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--learn)]/15 text-[var(--learn)]">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold">C'est fait !</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Tu peux te reconnecter avec ton nouveau mot de passe.</p>
            <button
              onClick={() => navigate({ to: "/auth/login" })}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 font-bold text-white"
            >
              Aller à la connexion
            </button>
          </div>
        )}
        <p className="mt-5 text-center text-sm">
          <Link to="/auth/login" className="font-semibold hover:text-[var(--orange-warm)]">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}

function FieldPwd({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      <div className="relative mt-1">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--cream)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--orange-warm)] focus:ring-2 focus:ring-[var(--orange-warm)]/25"
        />
      </div>
    </label>
  );
}
