import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setAuthed } from "@/lib/auth-store";
import { Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Se connecter — SkillBridge" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("lea.dubois@ecole.fr");
  const [pwd, setPwd] = useState("");

  return (
    <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
      <div className="hidden lg:block">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--orange-warm)]">Content de te revoir</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-tight">
          Reprends là où <span className="text-[var(--orange-warm)]">tu t'es arrêté·e</span>.
        </h1>
        <p className="mt-5 max-w-md text-[var(--muted-foreground)]">
          Tes sessions, tes crédits et tes échanges t'attendent. Connecte-toi pour replonger dans
          l'entraide.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setAuthed(true); navigate({ to: "/connexions" }); }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[var(--border)]"
      >
        <h2 className="font-display text-3xl font-extrabold">Se connecter</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Heureux·se de te revoir.</p>

        <div className="mt-6 space-y-4">
          <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} />
          <Field icon={Lock} label="Mot de passe" type="password" value={pwd} onChange={setPwd} />
          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-xs font-semibold text-[var(--orange-warm)] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)] hover:-translate-y-0.5"
        >
          Connexion <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-5 text-center text-sm text-[var(--muted-foreground)]">
          Pas encore inscrit·e ?{" "}
          <Link to="/auth/register" className="font-semibold text-[var(--ink)] hover:text-[var(--orange-warm)]">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({ icon: Icon, label, type, value, onChange }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; type: string; value: string;
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
