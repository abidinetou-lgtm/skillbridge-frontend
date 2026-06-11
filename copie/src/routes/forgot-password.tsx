import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — SkillBridge" },
      { name: "description", content: "Réinitialise ton mot de passe SkillBridge." },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          {sent ? (
            <div className="animate-fade-up text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage/15 text-sage">
                <MailCheck className="h-8 w-8" />
              </span>
              <h1 className="mt-5 text-2xl font-black tracking-tight text-navy">Email envoyé</h1>
              <p className="mt-2 text-sm text-foreground/60">
                Si un compte existe pour <span className="font-semibold text-navy">{email || "ton email"}</span>,
                tu recevras un lien de réinitialisation dans quelques minutes.
              </p>
              <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black tracking-tight text-navy">
                Réinitialise ton mot de passe
              </h1>
              <p className="mt-2 text-sm text-foreground/60">
                Entre ton adresse email et nous t'enverrons un lien de réinitialisation.
              </p>
              <div className="mt-6 space-y-1.5">
                <Label className="text-sm font-semibold text-navy">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jimel@email.com"
                    className="h-11 rounded-xl border-border bg-light-cream pl-10"
                  />
                </div>
              </div>
              <Button variant="accent" size="lg" className="mt-6 w-full" onClick={() => setSent(true)}>
                Envoyer le lien
              </Button>
              <Link
                to="/"
                className="mt-5 inline-flex w-full items-center justify-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
              >
                <ArrowLeft className="h-4 w-4" /> Retour à la connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
