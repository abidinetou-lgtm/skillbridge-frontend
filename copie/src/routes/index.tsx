import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDecor from "@/components/FloatingDecor";
import Reveal from "@/components/Reveal";
import TechIcon from "@/components/TechIcon";
import { PILLS, SUBJECTS } from "@/lib/mock-data";
import { BookOpen, Sparkles, Heart, ArrowRight, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Enseigne ce que tu sais. Apprends ce qui te manque." },
      { name: "description", content: "Plateforme d'entraide entre élèves. Échange tes compétences contre des crédits — 1 crédit = 1 minute de cours." },
      { property: "og:title", content: "SkillBridge — Entraide entre élèves" },
      { property: "og:description", content: "Enseigne, apprends, progresse — sans argent, juste des crédits." },
    ],
  }),
  component: Index,
});

const HERO_SCENES = [
  { label: "Étudiants qui codent ensemble", bg: "linear-gradient(135deg,#3F6B4C 0%,#252840 100%)" },
  { label: "Cours de guitare entre amis",   bg: "linear-gradient(135deg,#D98E4A 0%,#7a3f1a 100%)" },
  { label: "Atelier cuisine étudiant",      bg: "linear-gradient(135deg,#c9bce6 0%,#252840 100%)" },
  { label: "Révisions à la BU",             bg: "linear-gradient(135deg,#b9d4e8 0%,#3F6B4C 100%)" },
];

function Index() {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setScene((s) => (s + 1) % HERO_SCENES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Carrousel de fonds */}
        <div className="absolute inset-0 -z-10">
          {HERO_SCENES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-[1400ms]"
              style={{ background: s.bg, opacity: scene === i ? 1 : 0 }}
              aria-label={s.label}
            />
          ))}
          <div className="absolute inset-0 bg-[var(--ink)]/45" />
        </div>

        <FloatingDecor variant="hero" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> L'entraide entre élèves
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl md:text-7xl">
              Enseigne ce que tu sais.<br />
              <span className="text-[var(--orange-warm)]">Apprends ce qui te manque.</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-2xl text-balance text-base text-white/85 sm:text-lg">
              SkillBridge réunit les élèves de ton école pour s'entraider. Pas d'argent, juste des
              crédits que tu gagnes en partageant et que tu dépenses en apprenant.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-warm)] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--orange-warm-dark)] hover:-translate-y-0.5"
              >
                Rejoindre l'entraide <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth/login"
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[var(--ink)]"
              >
                Se connecter
              </Link>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {PILLS.map((p) => (
                <span key={p} className="pill bg-white/95 backdrop-blur">
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 façons de progresser */}
      <section className="relative overflow-hidden py-24">
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-wider text-[var(--orange-warm)]">Comment ça marche</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mx-auto mt-3 max-w-3xl text-center font-display text-4xl font-extrabold sm:text-5xl">
              Trois façons de progresser ensemble
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "Rattrape un cours", txt: "Tu as séché un TD ? Un·e camarade te le reprend tranquille, à ton rythme.", color: "var(--peach)", line: "var(--orange-warm)" },
              { icon: GraduationCap, title: "Apprends une nouvelle techno", txt: "React, Docker, Python... Des étudiants passionnés t'initient pas à pas.", color: "var(--mint)", line: "var(--learn)" },
              { icon: Heart, title: "Partage ta passion", txt: "Guitare, cuisine, photo : enseigne ce qui te fait kiffer et gagne des crédits.", color: "var(--lavender)", line: "var(--ink)" },
            ].map((c, i) => (
              <Reveal key={c.title} delay={(i + 1) as 1 | 2 | 3}>
                <article className="card-lift relative h-full overflow-hidden rounded-3xl bg-white p-7 shadow-sm">
                  <div className="absolute inset-x-0 top-0 h-2" style={{ background: c.line }} />
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl" style={{ background: c.color }}>
                    <c.icon className="h-9 w-9 text-[var(--ink)]" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-foreground)]">{c.txt}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Matières & technos */}
      <section className="relative overflow-hidden py-24" style={{ background: "#fdfaf2" }}>
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-wider text-[var(--learn)]">Le catalogue</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mx-auto mt-3 max-w-3xl text-center font-display text-4xl font-extrabold sm:text-5xl">
              Matières & technos enseignées
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted-foreground)]">
              De l'algèbre à React, du réseau au design — quelqu'un a forcément ce qu'il te faut.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {SUBJECTS.map((s, i) => (
              <Reveal key={s.name} delay={(((i % 5) + 1) as 1 | 2 | 3 | 4 | 5)}>
                <div className="card-lift flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
                  <TechIcon name={s.name} />
                  <span className="text-center text-sm font-semibold">{s.name}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={3}>
            <div className="mt-12 text-center">
              <Link
                to="/connexions"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--ink)]/85 hover:-translate-y-0.5"
              >
                Trouver quelqu'un à apprendre <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Système de crédits */}
      <section className="relative overflow-hidden bg-[var(--ink)] py-24 text-white">
        <FloatingDecor variant="dense" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal>
                <p className="text-sm font-bold uppercase tracking-wider text-[var(--orange-warm)]">Le système de crédits</p>
              </Reveal>
              <Reveal delay={1}>
                <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                  1 crédit = <span className="text-[var(--orange-warm)]">1 minute</span> de cours.
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="mt-5 max-w-xl text-white/80">
                  Pas de portefeuille, pas d'abonnement. Tu reçois des crédits en enseignant,
                  tu les dépenses en apprenant. On démarre tous au même endroit, on grandit ensemble.
                </p>
              </Reveal>
              <Reveal delay={3}>
                <ul className="mt-6 space-y-3 text-white/85">
                  <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--orange-warm)]" /> 60 crédits offerts à l'inscription, pour démarrer sans stress.</li>
                  <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--orange-warm)]" /> Plafond de 500 crédits — pour t'inciter à apprendre, pas à thésauriser.</li>
                  <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--orange-warm)]" /> Zéro argent réel n'est jamais échangé.</li>
                </ul>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { v: "60", l: "crédits offerts à l'inscription", c: "var(--orange-warm)" },
                { v: "500", l: "plafond — bouge-toi !", c: "var(--peach)" },
                { v: "1 240", l: "élèves dans l'entraide", c: "var(--mint)" },
                { v: "8 700", l: "minutes échangées ce mois", c: "var(--lavender)" },
              ].map((s, i) => (
                <Reveal key={s.l} delay={((i + 1) as 1 | 2 | 3 | 4)}>
                  <div className="card-lift rounded-3xl bg-white/5 p-6 backdrop-blur ring-1 ring-white/10">
                    <div className="font-display text-5xl font-extrabold" style={{ color: s.c }}>{s.v}</div>
                    <div className="mt-2 text-sm text-white/75">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
