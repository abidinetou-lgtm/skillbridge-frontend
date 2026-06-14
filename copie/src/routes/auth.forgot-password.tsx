import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — SkillBridge" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[var(--border)]">
        {!sent ? (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <h2 className="font-display text-3xl font-extrabold">Mot de passe oublié ?</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Indique ton email — on t'envoie un lien de réinitialisation.
            </p>
            <label className="mt-6 block">
              <span className="text-xs font-bold uppercase tracking-wider">Email</span>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--cream)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--orange-warm)] focus:ring-2 focus:ring-[var(--orange-warm)]/25"
                />
              </div>
            </label>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)]">
              Envoyer le lien <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--learn)]/15 text-[var(--learn)]">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold">Email envoyé</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Si un compte est associé à <strong>{email}</strong>, tu vas recevoir un email dans une minute.
            </p>
            <Link
              to="/auth/reset-password"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-white"
            >
              Voir la page de réinitialisation
            </Link>
          </div>
        )}
        <p className="mt-5 text-center text-sm">
          <Link to="/auth/login" className="font-semibold text-[var(--ink)] hover:text-[var(--orange-warm)]">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
