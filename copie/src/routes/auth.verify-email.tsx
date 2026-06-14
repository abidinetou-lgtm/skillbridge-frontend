import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MailCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Vérifier ton email — SkillBridge" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setAt = (i: number, v: string) => {
    const next = [...code];
    next[i] = v.slice(-1);
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const filled = code.every((c) => c.length === 1);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[var(--border)] text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--orange-warm)]/15 text-[var(--orange-warm)]">
          <MailCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-extrabold">Vérifie ton email</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          On t'a envoyé un code à 6 chiffres. Tape-le ci-dessous pour activer ton compte.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={c}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !c && i > 0) refs.current[i - 1]?.focus(); }}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-12 rounded-2xl border border-[var(--border)] bg-[var(--cream)] text-center font-display text-2xl font-bold outline-none focus:border-[var(--orange-warm)] focus:ring-2 focus:ring-[var(--orange-warm)]/25"
            />
          ))}
        </div>
        <button
          disabled={!filled}
          onClick={() => navigate({ to: "/connexions" })}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--orange-warm)] px-5 py-3 font-bold text-white transition hover:bg-[var(--orange-warm-dark)] disabled:opacity-50"
        >
          Confirmer <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-5 text-xs text-[var(--muted-foreground)]">
          Tu n'as rien reçu ? <button className="font-semibold text-[var(--orange-warm)] hover:underline">Renvoyer le code</button>
        </p>
      </div>
    </div>
  );
}
